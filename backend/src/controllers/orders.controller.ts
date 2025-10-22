import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../app';
import { logger } from '../utils/simple-logger';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import * as MercadoPagoIntegration from '../integrations/mercadopago-mock.integration';
import { calculateShipping } from '../services/shipping.service';

// Schemas de validação
const calculateShippingSchema = z.object({
  zipcode: z.string().length(8, 'CEP deve ter 8 dígitos'),
  items: z.array(z.object({
    variantId: z.string(),
    quantity: z.number().min(1),
  })),
});

const createOrderSchema = z.object({
  shippingAddressId: z.string(),
  paymentMethod: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'BOLETO']),
  couponCode: z.string().optional(),
  items: z.array(z.object({
    variantId: z.string(),
    quantity: z.number().min(1),
  })),
});

/**
 * Calcular frete para os itens
 */
export const calculateOrderShipping = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = calculateShippingSchema.parse(req.body);
    const userId = req.user!.id;

    // Buscar itens e validar estoque
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: validatedData.items.map(item => item.variantId) },
        active: true,
      },
      include: {
        product: true,
        stock: true,
      },
    });

    if (variants.length !== validatedData.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Alguns produtos não foram encontrados',
      });
    }

    // Verificar estoque
    const stockErrors = [];
    for (const requestItem of validatedData.items) {
      const variant = variants.find((v: any) => v.id === requestItem.variantId);
      if (!variant || !variant.stock || variant.stock.quantity < requestItem.quantity) {
        stockErrors.push({
          variantId: requestItem.variantId,
          available: variant?.stock?.quantity || 0,
          requested: requestItem.quantity,
        });
      }
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoque insuficiente para alguns itens',
        errors: stockErrors,
      });
    }

    // Preparar dados para cálculo de frete
    const shippingItems = validatedData.items.map(item => {
      const variant = variants.find((v: any) => v.id === item.variantId);
      return {
        variantId: variant!.id,
        name: variant!.name,
        quantity: item.quantity,
        weight: variant!.product.weightKg,
        dimensions: variant!.product.dimensionsCm as any,
        value: variant!.priceBrl,
      };
    });

    // Calcular frete
    const shippingOptions = await calculateShipping({
      zipcode: validatedData.zipcode,
      items: shippingItems,
    });

    logger.info('Shipping calculated', {
      userId,
      zipcode: validatedData.zipcode,
      itemsCount: validatedData.items.length,
    });

    res.json({
      success: true,
      data: {
        shippingOptions,
        items: validatedData.items.map(item => {
          const variant = variants.find((v: any) => v.id === item.variantId);
          return {
            variantId: variant!.id,
            name: variant!.name,
            quantity: item.quantity,
            unitPrice: variant!.priceBrl,
            totalPrice: variant!.priceBrl.mul(item.quantity),
          };
        }),
      },
    });
  } catch (error) {
    logger.error('Error calculating shipping:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Criar novo pedido
 */
export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user!.id;

    // Validar endereço
    const address = await prisma.address.findFirst({
      where: {
        id: validatedData.shippingAddressId,
        userId,
      },
    });

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Endereço não encontrado',
      });
    }

    // Buscar e validar itens
    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: validatedData.items.map(item => item.variantId) },
        active: true,
      },
      include: {
        product: true,
        stock: true,
      },
    });

    if (variants.length !== validatedData.items.length) {
      return res.status(400).json({
        success: false,
        message: 'Alguns produtos não foram encontrados',
      });
    }

    // Verificar estoque e reservar
    const stockErrors = [];
    for (const requestItem of validatedData.items) {
      const variant = variants.find((v: any) => v.id === requestItem.variantId);
      const availableStock = variant!.stock!.quantity - variant!.stock!.reservedQuantity;
      
      if (availableStock < requestItem.quantity) {
        stockErrors.push({
          variantId: requestItem.variantId,
          available: availableStock,
          requested: requestItem.quantity,
        });
      }
    }

    if (stockErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Estoque insuficiente',
        errors: stockErrors,
      });
    }

    // Calcular valores
    let subtotal = 0;
    const orderItems = validatedData.items.map(item => {
      const variant = variants.find((v: any) => v.id === item.variantId)!;
      const totalPrice = variant.priceBrl.mul(item.quantity);
      subtotal += parseFloat(totalPrice.toString());
      
      return {
        variantId: variant.id,
        quantity: item.quantity,
        unitPriceBrl: variant.priceBrl,
        totalPriceBrl: totalPrice,
      };
    });

    // Calcular frete
    const shippingItems = validatedData.items.map(item => {
      const variant = variants.find((v: any) => v.id === item.variantId)!;
      return {
        variantId: variant.id,
        name: variant.name,
        quantity: item.quantity,
        weight: variant.product.weightKg,
        dimensions: variant.product.dimensionsCm as any,
        value: variant.priceBrl,
      };
    });

    const shippingOptions = await calculateShipping({
      zipcode: address.zipcode,
      items: shippingItems,
    });

    const shippingCost = shippingOptions[0]?.price || 0; // Usar a primeira opção por padrão

    // Aplicar cupom se fornecido
    let discount = 0;
    let coupon = null;
    if (validatedData.couponCode) {
      coupon = await prisma.coupon.findFirst({
        where: {
          code: validatedData.couponCode,
          active: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      });

      if (coupon) {
        if (coupon.minOrderValue && subtotal < parseFloat(coupon.minOrderValue.toString())) {
          return res.status(400).json({
            success: false,
            message: `Valor mínimo para este cupom é R$ ${coupon.minOrderValue}`,
          });
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          return res.status(400).json({
            success: false,
            message: 'Cupom esgotado',
          });
        }

        // Calcular desconto
        if (coupon.type === 'PERCENTAGE') {
          discount = subtotal * (parseFloat(coupon.value.toString()) / 100);
        } else if (coupon.type === 'FIXED_AMOUNT') {
          discount = parseFloat(coupon.value.toString());
        } else if (coupon.type === 'FREE_SHIPPING') {
          discount = shippingCost;
        }
      }
    }

    const total = subtotal + shippingCost - discount;

    // Gerar número do pedido
    const orderNumber = `IMP${Date.now()}`;

    // Usar transação para criar pedido
    const result = await prisma.$transaction(async (tx: any) => {
      // Criar pedido
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          shippingAddressId: address.id,
          status: 'PENDING',
          subtotalBrl: subtotal,
          shippingBrl: shippingCost,
          discountBrl: discount,
          totalBrl: total,
          metadata: {
            paymentMethod: validatedData.paymentMethod,
            couponCode: validatedData.couponCode,
            shippingOption: shippingOptions[0],
          },
        },
      });

      // Criar itens do pedido
      await tx.orderItem.createMany({
        data: orderItems.map(item => ({
          orderId: order.id,
          ...item,
        })),
      });

      // Reservar estoque
      for (const item of validatedData.items) {
        await tx.stock.update({
          where: { variantId: item.variantId },
          data: {
            reservedQuantity: {
              increment: item.quantity,
            },
          },
        });
      }

      // Atualizar contador do cupom
      if (coupon) {
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            usedCount: { increment: 1 },
          },
        });
      }

      // Limpar carrinho do usuário
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return order;
    });

    // Criar preferência de pagamento no Mercado Pago
    const paymentItems = orderItems.map(item => {
      const variant = variants.find((v: any) => v.id === item.variantId)!;
      return {
        id: variant.id,
        title: variant.name,
        quantity: item.quantity,
        unit_price: parseFloat(item.unitPriceBrl.toString()),
      };
    });

    // Adicionar frete como item se > 0
    if (shippingCost > 0) {
      paymentItems.push({
        id: 'shipping',
        title: 'Frete',
        quantity: 1,
        unit_price: shippingCost,
      });
    }

    const paymentPreference = await MercadoPagoIntegration.createPaymentPreference({
      items: paymentItems,
      payer: {
        email: req.user!.email,
        name: 'Cliente',
        surname: 'David Importados',
      },
      external_reference: result.id,
    });

    // Criar registro de pagamento
    await prisma.payment.create({
      data: {
        orderId: result.id,
        externalId: paymentPreference.id,
        method: validatedData.paymentMethod,
        status: 'PENDING',
        amountBrl: total,
        gatewayResponse: paymentPreference,
      },
    });

    logger.info('Order created', {
      orderId: result.id,
      orderNumber: result.orderNumber,
      userId,
      total,
      paymentPreferenceId: paymentPreference.id,
    });

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: {
        order: {
          id: result.id,
          orderNumber: result.orderNumber,
          status: result.status,
          subtotal: result.subtotalBrl,
          shipping: result.shippingBrl,
          discount: result.discountBrl,
          total: result.totalBrl,
        },
        payment: {
          preferenceId: paymentPreference.id,
          initPoint: paymentPreference.init_point,
        },
      },
    });
  } catch (error) {
    logger.error('Error creating order:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Listar pedidos do usuário
 */
export const getUserOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;

    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { status: status as any }),
    };

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                },
              },
            },
          },
          payment: {
            select: {
              status: true,
              method: true,
            },
          },
          shipments: {
            select: {
              trackingCode: true,
              carrier: true,
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    logger.error('Error getting user orders:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Buscar pedido específico
 */
export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
        payment: true,
        shipments: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado',
      });
    }

    res.json({
      success: true,
      data: { order },
    });
  } catch (error) {
    logger.error('Error getting order by ID:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

/**
 * Cancelar pedido
 */
export const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { reason } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      include: {
        items: true,
        payment: true,
      },
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Pedido não pode ser cancelado',
      });
    }

    // Usar transação para cancelar pedido
    await prisma.$transaction(async (tx: any) => {
      // Atualizar status do pedido
      await tx.order.update({
        where: { id },
        data: {
          status: 'CANCELLED',
          metadata: {
            ...order.metadata as any,
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason,
          },
        },
      });

      // Liberar estoque reservado
      for (const item of order.items) {
        await tx.stock.update({
          where: { variantId: item.variantId },
          data: {
            reservedQuantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Atualizar status do pagamento se existir
      if (order.payment) {
        await tx.payment.update({
          where: { id: order.payment.id },
          data: { status: 'CANCELLED' },
        });
      }
    });

    logger.info('Order cancelled', {
      orderId: id,
      userId,
      reason,
    });

    res.json({
      success: true,
      message: 'Pedido cancelado com sucesso',
    });
  } catch (error) {
    logger.error('Error cancelling order:', error);

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
    });
  }
};

// Exportar todas as funções como um objeto padrão
export default {
  calculateOrderShipping,
  getUserOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  getAllOrders: getUserOrders, // Alias para admin
  updateOrderStatus: cancelOrder, // Placeholder - implementar depois
  updateTracking: cancelOrder // Placeholder - implementar depois
};
