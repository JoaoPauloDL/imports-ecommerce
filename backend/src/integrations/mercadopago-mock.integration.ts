import { logger } from '../utils/simple-logger';

// Configurar Mercado Pago (apenas se token estiver disponível)
if (process.env.MERCADO_PAGO_ACCESS_TOKEN) {
  logger.info('MercadoPago configured with access token');
} else {
  logger.warn('MercadoPago access token not found, using mock implementation');
}

// Tipos para as respostas do MercadoPago
export interface PaymentPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  checkout_pro_url: string;
  collector_id: string;
  operation_type: string;
  items: any[];
}

export interface PaymentStatus {
  id: string;
  status: string;
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  external_reference?: string;
}

export interface RefundResponse {
  id: string;
  payment_id: string;
  amount: number;
  status: string;
  date_created: string;
}

// Mock implementations para desenvolvimento
export async function createPaymentPreference(order: any): Promise<PaymentPreference> {
  try {
    logger.info(`Creating payment preference for order ${order.id}`);

    // Mock response para desenvolvimento
    return {
      id: `mock-preference-${order.id}`,
      init_point: `${process.env.FRONTEND_URL}/checkout/mock-payment?order=${order.id}`,
      sandbox_init_point: `${process.env.FRONTEND_URL}/checkout/mock-payment?order=${order.id}`,
      checkout_pro_url: `${process.env.FRONTEND_URL}/checkout/mock-payment?order=${order.id}`,
      collector_id: 'mock-collector',
      operation_type: 'regular_payment',
      items: order.items || []
    };
  } catch (error) {
    logger.error('Error creating payment preference:', error);
    throw new Error('Erro ao criar preferência de pagamento');
  }
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  try {
    logger.info(`Getting payment status for ${paymentId}`);

    // Mock response para desenvolvimento
    return {
      id: paymentId,
      status: 'approved',
      status_detail: 'accredited',
      transaction_amount: 100.00,
      currency_id: 'BRL',
      external_reference: 'mock-order-id'
    };
  } catch (error) {
    logger.error('Error getting payment status:', error);
    throw new Error('Erro ao consultar status do pagamento');
  }
}

export async function processPaymentWebhook(notification: any): Promise<void> {
  try {
    logger.info('Processing MercadoPago webhook:', notification);
    
    // Mock processing
    logger.info('Webhook processed successfully (mock)');
  } catch (error) {
    logger.error('Error processing webhook:', error);
    throw error;
  }
}

export async function refundPayment(paymentId: string, amount?: number): Promise<RefundResponse> {
  try {
    logger.info(`Refunding payment ${paymentId}`);

    // Mock response para desenvolvimento
    return {
      id: `refund-${paymentId}`,
      payment_id: paymentId,
      amount: amount || 0,
      status: 'approved',
      date_created: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error refunding payment:', error);
    throw new Error('Erro ao processar reembolso');
  }
}