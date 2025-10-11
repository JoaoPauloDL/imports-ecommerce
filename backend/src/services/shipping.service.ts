import axios from 'axios';
import { logger } from '../utils/logger';

export interface ShippingItem {
  variantId: string;
  name: string;
  quantity: number;
  weight: number; // em kg
  dimensions: {
    width: number;
    height: number;
    length: number;
  }; // em cm
  value: number; // valor unitário
}

export interface ShippingCalculation {
  zipcode: string;
  items: ShippingItem[];
}

export interface ShippingOption {
  carrier: string;
  service: string;
  price: number;
  deliveryDays: number;
  description?: string;
}

/**
 * Calcular frete usando Melhor Envio
 */
export const calculateMelhorEnvio = async (data: ShippingCalculation): Promise<ShippingOption[]> => {
  try {
    const token = process.env.MELHOR_ENVIO_TOKEN;
    if (!token) {
      throw new Error('Token do Melhor Envio não configurado');
    }

    // Configurar dados para Melhor Envio
    const from = {
      postal_code: '01310-100', // CEP de origem (substitua pelo seu)
    };

    const to = {
      postal_code: data.zipcode,
    };

    // Agregar itens por peso e dimensões
    const totalWeight = data.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalValue = data.items.reduce((sum, item) => sum + (parseFloat(item.value.toString()) * item.quantity), 0);

    // Para simplicidade, usar as maiores dimensões encontradas
    const maxDimensions = data.items.reduce(
      (max, item) => ({
        width: Math.max(max.width, item.dimensions.width),
        height: Math.max(max.height, item.dimensions.height),
        length: Math.max(max.length, item.dimensions.length),
      }),
      { width: 0, height: 0, length: 0 }
    );

    const package = {
      weight: totalWeight,
      width: maxDimensions.width,
      height: maxDimensions.height,
      length: maxDimensions.length,
    };

    const requestData = {
      from,
      to,
      package,
      options: {
        receipt: false,
        own_hand: false,
        collect: false,
      },
      services: '1,2,3,4,7,8', // Códigos dos serviços (PAC, SEDEX, etc.)
    };

    const response = await axios.post(
      'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
      requestData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000,
      }
    );

    const options: ShippingOption[] = response.data
      .filter((service: any) => !service.error)
      .map((service: any) => ({
        carrier: service.company.name,
        service: service.name,
        price: parseFloat(service.price),
        deliveryDays: parseInt(service.delivery_time),
        description: `${service.company.name} - ${service.name}`,
      }))
      .sort((a: ShippingOption, b: ShippingOption) => a.price - b.price);

    return options;
  } catch (error) {
    logger.error('Error calculating shipping with Melhor Envio:', error);
    throw error;
  }
};

/**
 * Calcular frete usando Correios (simulação)
 */
export const calculateCorreios = async (data: ShippingCalculation): Promise<ShippingOption[]> => {
  try {
    // Implementação simplificada para demonstração
    // Em produção, usar a API oficial dos Correios
    
    const totalWeight = data.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
    const totalValue = data.items.reduce((sum, item) => sum + (parseFloat(item.value.toString()) * item.quantity), 0);

    // Simulação de cálculo baseado em peso e valor
    const pacPrice = Math.max(15, totalWeight * 2 + totalValue * 0.02);
    const sedexPrice = Math.max(25, totalWeight * 3 + totalValue * 0.03);

    return [
      {
        carrier: 'Correios',
        service: 'PAC',
        price: Math.round(pacPrice * 100) / 100,
        deliveryDays: 8,
        description: 'Correios PAC',
      },
      {
        carrier: 'Correios',
        service: 'SEDEX',
        price: Math.round(sedexPrice * 100) / 100,
        deliveryDays: 3,
        description: 'Correios SEDEX',
      },
    ];
  } catch (error) {
    logger.error('Error calculating shipping with Correios:', error);
    throw error;
  }
};

/**
 * Função principal para calcular frete
 */
export const calculateShipping = async (data: ShippingCalculation): Promise<ShippingOption[]> => {
  try {
    const results: ShippingOption[] = [];

    // Tentar Melhor Envio primeiro
    try {
      const melhorEnvioOptions = await calculateMelhorEnvio(data);
      results.push(...melhorEnvioOptions);
    } catch (error) {
      logger.warn('Melhor Envio calculation failed, falling back to Correios', error);
    }

    // Fallback para Correios se Melhor Envio falhar ou não retornar resultados
    if (results.length === 0) {
      const correiosOptions = await calculateCorreios(data);
      results.push(...correiosOptions);
    }

    // Verificar valor mínimo para frete grátis
    const freeShippingMinValue = parseFloat(process.env.FREE_SHIPPING_MIN_VALUE || '200');
    const totalValue = data.items.reduce((sum, item) => 
      sum + (parseFloat(item.value.toString()) * item.quantity), 0
    );

    if (totalValue >= freeShippingMinValue) {
      results.unshift({
        carrier: 'Grátis',
        service: 'Frete Grátis',
        price: 0,
        deliveryDays: parseInt(process.env.DEFAULT_SHIPPING_DAYS || '7'),
        description: `Frete grátis para compras acima de R$ ${freeShippingMinValue}`,
      });
    }

    // Ordenar por preço
    results.sort((a, b) => a.price - b.price);

    logger.info('Shipping calculated', {
      zipcode: data.zipcode,
      itemsCount: data.items.length,
      totalWeight: data.items.reduce((sum, item) => sum + (item.weight * item.quantity), 0),
      totalValue,
      optionsFound: results.length,
    });

    return results;
  } catch (error) {
    logger.error('Error calculating shipping:', error);
    
    // Fallback com frete padrão em caso de erro
    return [{
      carrier: 'Padrão',
      service: 'Frete Padrão',
      price: 15.00,
      deliveryDays: parseInt(process.env.DEFAULT_SHIPPING_DAYS || '7'),
      description: 'Frete padrão',
    }];
  }
};

/**
 * Validar CEP
 */
export const validateZipcode = (zipcode: string): boolean => {
  const cleanZipcode = zipcode.replace(/\D/g, '');
  return cleanZipcode.length === 8 && /^\d{8}$/.test(cleanZipcode);
};

/**
 * Buscar informações do CEP
 */
export const getZipcodeInfo = async (zipcode: string) => {
  try {
    if (!validateZipcode(zipcode)) {
      throw new Error('CEP inválido');
    }

    const cleanZipcode = zipcode.replace(/\D/g, '');
    
    // Usar API ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cleanZipcode}/json/`, {
      timeout: 5000,
    });

    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }

    return {
      zipcode: cleanZipcode,
      street: response.data.logradouro,
      neighborhood: response.data.bairro,
      city: response.data.localidade,
      state: response.data.uf,
      ibge: response.data.ibge,
    };
  } catch (error) {
    logger.error('Error getting zipcode info:', error);
    throw error;
  }
};