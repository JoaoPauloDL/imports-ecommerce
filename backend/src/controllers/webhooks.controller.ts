import { Request, Response } from 'express';
import { processPaymentWebhook as processMercadoPagoWebhook } from '../integrations/mercadopago-mock.integration';
import { prisma } from '../app';
import { logger } from '../utils/simple-logger';
import emailService from '../services/email-mock.service';

/**
 * Webhook do Mercado Pago
 */
export const mercadoPagoWebhook = async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;
    
    // Log do webhook recebido
    await prisma.webhookLog.create({
      data: {
        source: 'MERCADO_PAGO',
        eventType: webhookData.type || 'unknown',
        payload: webhookData,
        status: 'RECEIVED',
      },
    });

    logger.info('Mercado Pago webhook received', {
      type: webhookData.type,
      action: webhookData.action,
      dataId: webhookData.data?.id,
    });

    // Processar webhook apenas se for do tipo payment
    if (webhookData.type === 'payment') {
      await processMercadoPagoWebhook(webhookData);
      
      // TODO: Implementar lógica real do webhook
      logger.info('Payment webhook processed (mock)');
    }

    // Marcar webhook como processado
    await prisma.webhookLog.updateMany({
      where: {
        source: 'MERCADO_PAGO',
        payload: webhookData,
        status: 'RECEIVED',
      },
      data: {
        status: 'PROCESSED',
      },
    });

    // Mercado Pago espera resposta 200
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing Mercado Pago webhook:', error);

    // Marcar webhook como falho
    await prisma.webhookLog.updateMany({
      where: {
        source: 'MERCADO_PAGO',
        payload: req.body,
        status: 'RECEIVED',
      },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    // Ainda retornar 200 para não causar retry excessivo
    res.status(200).json({ success: false, error: 'Internal error' });
  }
};

/**
 * Processar atualização de pagamento
 */
const handlePaymentUpdate = async (paymentData: any) => {
  try {
    const externalReference = paymentData.external_reference;
    
    if (!externalReference) {
      logger.warn('Payment without external reference', { paymentId: paymentData.id });
      return;
    }

    // Buscar pedido pelo external_reference (order ID)
    const order = await prisma.order.findUnique({
      where: { id: externalReference },
      include: {
        payment: true,
        user: true,
        items: {
          include: {
            variant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      logger.warn('Order not found for payment', {
        externalReference,
        paymentId: paymentData.id,
      });
      return;
    }

    // Atualizar pagamento
    const updatedPayment = await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        status: mapMercadoPagoStatus(paymentData.status),
        gatewayResponse: paymentData,
      },
    });

    // Atualizar status do pedido baseado no status do pagamento
    let newOrderStatus = order.status;
    
    switch (paymentData.status) {
      case 'approved':
        newOrderStatus = 'CONFIRMED';
        await handlePaymentApproved(order);
        break;
      case 'rejected':
      case 'cancelled':
        newOrderStatus = 'CANCELLED';
        await handlePaymentRejected(order);
        break;
      case 'refunded':
      case 'charged_back':
        newOrderStatus = 'REFUNDED';
        await handlePaymentRefunded(order);
        break;
      default:
        // Manter status atual para pending e outros
        break;
    }

    if (newOrderStatus !== order.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: newOrderStatus },
      });
    }

    logger.info('Payment updated successfully', {
      orderId: order.id,
      paymentId: paymentData.id,
      oldStatus: order.payment?.status,
      newStatus: updatedPayment.status,
      orderStatus: newOrderStatus,
    });
  } catch (error) {
    logger.error('Error handling payment update:', error);
    throw error;
  }
};

/**
 * Mapear status do Mercado Pago para nossos status
 */
const mapMercadoPagoStatus = (mpStatus: string) => {
  const statusMap: Record<string, any> = {
    pending: 'PENDING',
    approved: 'APPROVED',
    authorized: 'APPROVED',
    in_process: 'PENDING',
    in_mediation: 'PENDING',
    rejected: 'REJECTED',
    cancelled: 'CANCELLED',
    refunded: 'REFUNDED',
    charged_back: 'CHARGED_BACK',
  };

  return statusMap[mpStatus] || 'PENDING';
};

/**
 * Processar pagamento aprovado
 */
const handlePaymentApproved = async (order: any) => {
  try {
    // Confirmar estoque (converter reservado para vendido)
    for (const item of order.items) {
      await prisma.stock.update({
        where: { variantId: item.variantId },
        data: {
          quantity: { decrement: item.quantity },
          reservedQuantity: { decrement: item.quantity },
        },
      });
    }

    // Enviar email de confirmação
    await emailService.sendOrderConfirmation(order.user.email, {
      customerName: order.user.fullName,
      orderNumber: order.orderNumber,
      orderId: order.id,
      total: order.totalBrl.toString(),
      status: 'Confirmado',
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    });

    logger.info('Payment approved processed', { orderId: order.id });
  } catch (error) {
    logger.error('Error processing approved payment:', error);
    throw error;
  }
};

/**
 * Processar pagamento rejeitado/cancelado
 */
const handlePaymentRejected = async (order: any) => {
  try {
    // Liberar estoque reservado
    for (const item of order.items) {
      await prisma.stock.update({
        where: { variantId: item.variantId },
        data: {
          reservedQuantity: { decrement: item.quantity },
        },
      });
    }

    logger.info('Payment rejected processed', { orderId: order.id });
  } catch (error) {
    logger.error('Error processing rejected payment:', error);
    throw error;
  }
};

/**
 * Processar pagamento estornado
 */
const handlePaymentRefunded = async (order: any) => {
  try {
    // Devolver estoque se ainda não foi devolvido
    if (order.status === 'DELIVERED' || order.status === 'SHIPPED') {
      for (const item of order.items) {
        await prisma.stock.update({
          where: { variantId: item.variantId },
          data: {
            quantity: { increment: item.quantity },
          },
        });
      }
    }

    logger.info('Payment refunded processed', { orderId: order.id });
  } catch (error) {
    logger.error('Error processing refunded payment:', error);
    throw error;
  }
};

/**
 * Webhook do Melhor Envio
 */
export const melhorEnvioWebhook = async (req: Request, res: Response) => {
  try {
    const webhookData = req.body;

    // Log do webhook
    await prisma.webhookLog.create({
      data: {
        source: 'MELHOR_ENVIO',
        eventType: webhookData.event || 'unknown',
        payload: webhookData,
        status: 'RECEIVED',
      },
    });

    logger.info('Melhor Envio webhook received', {
      event: webhookData.event,
      trackingCode: webhookData.tracking,
    });

    // Processar diferentes tipos de eventos
    switch (webhookData.event) {
      case 'shipment.tracking.update':
        await handleShipmentTracking(webhookData);
        break;
      case 'shipment.status.update':
        await handleShipmentStatus(webhookData);
        break;
      default:
        logger.info('Unhandled Melhor Envio event', { event: webhookData.event });
    }

    // Marcar como processado
    await prisma.webhookLog.updateMany({
      where: {
        source: 'MELHOR_ENVIO',
        payload: webhookData,
        status: 'RECEIVED',
      },
      data: {
        status: 'PROCESSED',
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Error processing Melhor Envio webhook:', error);

    await prisma.webhookLog.updateMany({
      where: {
        source: 'MELHOR_ENVIO',
        payload: req.body,
        status: 'RECEIVED',
      },
      data: {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    res.status(200).json({ success: false });
  }
};

/**
 * Processar atualização de rastreamento
 */
const handleShipmentTracking = async (webhookData: any) => {
  try {
    const trackingCode = webhookData.tracking;
    
    if (!trackingCode) {
      return;
    }

    // Buscar envio pelo código de rastreamento
    const shipment = await prisma.shipment.findFirst({
      where: { trackingCode },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!shipment) {
      logger.warn('Shipment not found for tracking', { trackingCode });
      return;
    }

    // Mapear status do Melhor Envio
    const newStatus = mapMelhorEnvioStatus(webhookData.status);

    // Atualizar status do envio
    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: newStatus,
        metadata: {
          ...shipment.metadata as any,
          lastTracking: webhookData,
          updatedAt: new Date().toISOString(),
        },
      },
    });

    // Se foi entregue, atualizar o pedido
    if (newStatus === 'DELIVERED') {
      await prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    // Enviar email de atualização
    await emailService.sendOrderStatusUpdate(shipment.order.user.email, {
      customerName: shipment.order.user.fullName,
      orderNumber: shipment.order.orderNumber,
      orderId: shipment.order.id,
      status: getStatusDescription(newStatus),
      trackingCode,
      carrier: shipment.carrier,
    });

    logger.info('Shipment tracking updated', {
      shipmentId: shipment.id,
      trackingCode,
      status: newStatus,
    });
  } catch (error) {
    logger.error('Error handling shipment tracking:', error);
    throw error;
  }
};

/**
 * Processar atualização de status de envio
 */
const handleShipmentStatus = async (webhookData: any) => {
  // Similar ao tracking, mas para mudanças de status específicas
  await handleShipmentTracking(webhookData);
};

/**
 * Mapear status do Melhor Envio
 */
const mapMelhorEnvioStatus = (meStatus: string) => {
  const statusMap: Record<string, any> = {
    posted: 'COLLECTED',
    delivered: 'DELIVERED',
    undelivered: 'FAILED',
    returning: 'RETURNED',
    returned: 'RETURNED',
  };

  return statusMap[meStatus] || 'IN_TRANSIT';
};

/**
 * Obter descrição do status
 */
const getStatusDescription = (status: string) => {
  const descriptions: Record<string, string> = {
    PENDING: 'Pendente',
    COLLECTED: 'Coletado',
    IN_TRANSIT: 'Em trânsito',
    OUT_FOR_DELIVERY: 'Saiu para entrega',
    DELIVERED: 'Entregue',
    FAILED: 'Falha na entrega',
    RETURNED: 'Devolvido',
  };

  return descriptions[status] || status;
};
