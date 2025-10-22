import MercadoPago from 'mercadopago';
import { logger } from '../utils/simple-logger';

// Configurar Mercado Pago (apenas se token estiver disponível)
if (process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  MercadoPago.configure({
    access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  });
}

export interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  unit_price: number;
}

export interface PaymentPayer {
  name?: string;
  surname?: string;
  email?: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    street_name?: string;
    street_number?: number;
    zip_code?: string;
  };
}

export interface PaymentPreferenceData {
  items: PaymentItem[];
  payer?: PaymentPayer;
  back_urls?: {
    success?: string;
    failure?: string;
    pending?: string;
  };
  auto_return?: 'approved' | 'all';
  payment_methods?: {
    excluded_payment_methods?: Array<{ id: string }>;
    excluded_payment_types?: Array<{ id: string }>;
    installments?: number;
  };
  notification_url?: string;
  statement_descriptor?: string;
  external_reference?: string;
  expires?: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

/**
 * Criar preferência de pagamento no Mercado Pago
 */
export const createPaymentPreference = async (data: PaymentPreferenceData) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const webhookUrl = process.env.WEBHOOK_BASE_URL || 'http://localhost:3001/api/webhooks';

    const preference = {
      items: data.items.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        picture_url: item.picture_url,
        category_id: item.category_id || 'others',
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: 'BRL',
      })),
      
      payer: data.payer ? {
        name: data.payer.name,
        surname: data.payer.surname,
        email: data.payer.email,
        phone: data.payer.phone,
        identification: data.payer.identification,
        address: data.payer.address,
      } : undefined,

      back_urls: {
        success: data.back_urls?.success || `${baseUrl}/checkout/success`,
        failure: data.back_urls?.failure || `${baseUrl}/checkout/failure`,
        pending: data.back_urls?.pending || `${baseUrl}/checkout/pending`,
      },

      auto_return: data.auto_return || 'approved',

      payment_methods: {
        excluded_payment_methods: data.payment_methods?.excluded_payment_methods || [],
        excluded_payment_types: data.payment_methods?.excluded_payment_types || [],
        installments: data.payment_methods?.installments || 12,
      },

      notification_url: `${webhookUrl}/mercadopago`,
      statement_descriptor: data.statement_descriptor || 'IMPORTS STORE',
      external_reference: data.external_reference,
      expires: data.expires || true,
      expiration_date_from: data.expiration_date_from,
      expiration_date_to: data.expiration_date_to || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    const response = await MercadoPago.preferences.create(preference);

    logger.info('Payment preference created', {
      preferenceId: response.body.id,
      externalReference: data.external_reference,
    });

    return {
      id: response.body.id,
      init_point: response.body.init_point,
      sandbox_init_point: response.body.sandbox_init_point,
      external_reference: response.body.external_reference,
    };
  } catch (error) {
    logger.error('Error creating payment preference:', error);
    throw new Error('Erro ao criar preferência de pagamento');
  }
};

/**
 * Buscar informações de um pagamento
 */
export const getPaymentInfo = async (paymentId: string) => {
  try {
    const response = await MercadoPago.payment.findById(paymentId);
    
    logger.info('Payment info retrieved', { paymentId });
    
    return response.body;
  } catch (error) {
    logger.error('Error getting payment info:', { error, paymentId });
    throw new Error('Erro ao buscar informações do pagamento');
  }
};

/**
 * Processar webhook do Mercado Pago
 */
export const processWebhook = async (data: any) => {
  try {
    const { action, data: webhookData, id, live_mode, type, date_created, api_version, user_id } = data;

    logger.info('Processing Mercado Pago webhook', {
      action,
      type,
      id,
      live_mode,
      date_created,
    });

    // Verificar se é um webhook de pagamento
    if (type === 'payment') {
      const paymentInfo = await getPaymentInfo(webhookData.id);
      
      return {
        type: 'payment',
        payment: {
          id: paymentInfo.id,
          status: paymentInfo.status,
          status_detail: paymentInfo.status_detail,
          external_reference: paymentInfo.external_reference,
          transaction_amount: paymentInfo.transaction_amount,
          net_received_amount: paymentInfo.net_received_amount,
          total_paid_amount: paymentInfo.total_paid_amount,
          collector_id: paymentInfo.collector_id,
          payer: paymentInfo.payer,
          payment_method_id: paymentInfo.payment_method_id,
          payment_type_id: paymentInfo.payment_type_id,
          date_created: paymentInfo.date_created,
          date_approved: paymentInfo.date_approved,
          date_last_updated: paymentInfo.date_last_updated,
          description: paymentInfo.description,
          installments: paymentInfo.installments,
          issuer_id: paymentInfo.issuer_id,
          card: paymentInfo.card,
          operation_type: paymentInfo.operation_type,
        },
      };
    }

    // Outros tipos de webhook (merchant_order, etc.)
    return {
      type,
      data: webhookData,
    };
  } catch (error) {
    logger.error('Error processing Mercado Pago webhook:', error);
    throw error;
  }
};

/**
 * Verificar status de um pagamento
 */
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const paymentInfo = await getPaymentInfo(paymentId);
    
    return {
      id: paymentInfo.id,
      status: paymentInfo.status,
      status_detail: paymentInfo.status_detail,
      approved: paymentInfo.status === 'approved',
      pending: paymentInfo.status === 'pending',
      rejected: paymentInfo.status === 'rejected',
      cancelled: paymentInfo.status === 'cancelled',
      refunded: paymentInfo.status === 'refunded',
      charged_back: paymentInfo.status === 'charged_back',
    };
  } catch (error) {
    logger.error('Error checking payment status:', { error, paymentId });
    throw error;
  }
};

/**
 * Criar pagamento direto (sem preferência)
 */
export const createDirectPayment = async (paymentData: {
  transaction_amount: number;
  token: string;
  description: string;
  installments: number;
  payment_method_id: string;
  issuer_id?: string;
  payer: {
    email: string;
    identification?: {
      type: string;
      number: string;
    };
  };
  external_reference?: string;
  notification_url?: string;
}) => {
  try {
    const webhookUrl = process.env.WEBHOOK_BASE_URL || 'http://localhost:3001/api/webhooks';

    const payment = {
      transaction_amount: paymentData.transaction_amount,
      token: paymentData.token,
      description: paymentData.description,
      installments: paymentData.installments,
      payment_method_id: paymentData.payment_method_id,
      issuer_id: paymentData.issuer_id,
      payer: paymentData.payer,
      external_reference: paymentData.external_reference,
      notification_url: paymentData.notification_url || `${webhookUrl}/mercadopago`,
    };

    const response = await MercadoPago.payment.save(payment);

    logger.info('Direct payment created', {
      paymentId: response.body.id,
      status: response.body.status,
      externalReference: paymentData.external_reference,
    });

    return response.body;
  } catch (error) {
    logger.error('Error creating direct payment:', error);
    throw new Error('Erro ao processar pagamento');
  }
};

/**
 * Estornar um pagamento
 */
export const refundPayment = async (paymentId: string, amount?: number) => {
  try {
    const refundData = amount ? { amount } : {};
    
    const response = await MercadoPago.payment.refund(paymentId).create(refundData);

    logger.info('Payment refunded', {
      paymentId,
      refundId: response.body.id,
      amount: amount || 'full',
    });

    return response.body;
  } catch (error) {
    logger.error('Error refunding payment:', { error, paymentId, amount });
    throw new Error('Erro ao estornar pagamento');
  }
};
