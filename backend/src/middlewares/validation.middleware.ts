import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationError } from 'joi';
import { logger } from '../utils/simple-logger';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map((detail: any) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation error:', errorDetails);

      return res.status(400).json({
        success: false,
        message: 'Dados de entrada inválidos',
        errors: errorDetails
      });
    }

    // Substituir req.body pelos dados validados e limpos
    req.body = value;
    next();
  };
};

// Schemas de validação para David Importados
export const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
    name: Joi.string().min(2).max(100).required().messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome não pode ter mais de 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
    phone: Joi.string().pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).optional().messages({
      'string.pattern.base': 'Telefone deve estar no formato (11) 99999-9999'
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  product: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().required(),
    originalPrice: Joi.number().positive().optional(),
    category: Joi.string().required(),
    brand: Joi.string().max(100).optional(),
    volume: Joi.string().max(50).optional(),
    concentration: Joi.string().max(100).optional(),
    fraganceFamily: Joi.string().max(100).optional(),
    stockQuantity: Joi.number().integer().min(0).required(),
    images: Joi.array().items(Joi.string().uri()).max(10).optional(),
    isActive: Joi.boolean().optional(),
    isFeatured: Joi.boolean().optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  order: Joi.object({
    items: Joi.array().items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required()
      })
    ).min(1).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      number: Joi.string().required(),
      complement: Joi.string().optional().allow(''),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().length(2).required(),
      zipCode: Joi.string().pattern(/^\d{5}-?\d{3}$/).required(),
      recipient: Joi.string().required()
    }).required(),
    paymentMethod: Joi.string().valid('CREDIT_CARD', 'PIX', 'BOLETO').required(),
    notes: Joi.string().max(500).optional().allow('')
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).optional(),
    birthDate: Joi.date().optional()
  })
};

export default validateRequest;
