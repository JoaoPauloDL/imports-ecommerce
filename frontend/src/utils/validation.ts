export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export class ProductValidator {
  static validateProduct(data: any): ValidationResult {
    const errors: ValidationError[] = []

    // Validar nome
    if (!data.name || data.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Nome do produto é obrigatório',
        code: 'REQUIRED'
      })
    } else if (data.name.length < 2) {
      errors.push({
        field: 'name',
        message: 'Nome deve ter pelo menos 2 caracteres',
        code: 'MIN_LENGTH'
      })
    } else if (data.name.length > 100) {
      errors.push({
        field: 'name',
        message: 'Nome não pode ter mais de 100 caracteres',
        code: 'MAX_LENGTH'
      })
    }

    // Validar preço
    if (!data.price) {
      errors.push({
        field: 'price',
        message: 'Preço é obrigatório',
        code: 'REQUIRED'
      })
    } else {
      const price = parseFloat(data.price)
      if (isNaN(price)) {
        errors.push({
          field: 'price',
          message: 'Preço deve ser um número válido',
          code: 'INVALID_NUMBER'
        })
      } else if (price < 0) {
        errors.push({
          field: 'price',
          message: 'Preço não pode ser negativo',
          code: 'NEGATIVE_VALUE'
        })
      } else if (price > 999999.99) {
        errors.push({
          field: 'price',
          message: 'Preço muito alto (máximo: R$ 999.999,99)',
          code: 'MAX_VALUE'
        })
      }
    }

    // Validar estoque
    if (data.stockQuantity !== undefined && data.stockQuantity !== '') {
      const stock = parseInt(data.stockQuantity)
      if (isNaN(stock)) {
        errors.push({
          field: 'stockQuantity',
          message: 'Quantidade em estoque deve ser um número válido',
          code: 'INVALID_NUMBER'
        })
      } else if (stock < 0) {
        errors.push({
          field: 'stockQuantity',
          message: 'Estoque não pode ser negativo',
          code: 'NEGATIVE_VALUE'
        })
      } else if (stock > 999999) {
        errors.push({
          field: 'stockQuantity',
          message: 'Quantidade muito alta (máximo: 999.999)',
          code: 'MAX_VALUE'
        })
      }
    }

    // Validar SKU
    if (data.sku && data.sku.length > 50) {
      errors.push({
        field: 'sku',
        message: 'SKU não pode ter mais de 50 caracteres',
        code: 'MAX_LENGTH'
      })
    }

    // Validar descrição
    if (data.description && data.description.length > 1000) {
      errors.push({
        field: 'description',
        message: 'Descrição não pode ter mais de 1000 caracteres',
        code: 'MAX_LENGTH'
      })
    }

    // Validar URL da imagem
    if (data.imageUrl && data.imageUrl.trim()) {
      try {
        new URL(data.imageUrl)
      } catch {
        errors.push({
          field: 'imageUrl',
          message: 'URL da imagem deve ser um endereço válido',
          code: 'INVALID_URL'
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static getFieldError(errors: ValidationError[], field: string): string | null {
    const error = errors.find(e => e.field === field)
    return error ? error.message : null
  }
}

export class ApiErrorHandler {
  static handleError(error: any, operation: string): string {
    console.error(`Erro em ${operation}:`, error)

    if (error.message?.includes('fetch')) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.'
    }

    if (error.status === 401) {
      return 'Sua sessão expirou. Faça login novamente.'
    }

    if (error.status === 403) {
      return 'Você não tem permissão para realizar esta operação.'
    }

    if (error.status === 404) {
      return 'Recurso não encontrado. Pode ter sido removido ou não existe.'
    }

    if (error.status === 422) {
      return 'Dados enviados são inválidos. Verifique os campos e tente novamente.'
    }

    if (error.status >= 500) {
      return 'Erro interno do servidor. Tente novamente em alguns minutos.'
    }

    if (error.message) {
      return error.message
    }

    return 'Ocorreu um erro inesperado. Tente novamente.'
  }

  static parseApiError(response: any): string {
    if (response.message) {
      return response.message
    }

    if (response.error) {
      return typeof response.error === 'string' ? response.error : 'Erro na validação dos dados'
    }

    if (response.errors && Array.isArray(response.errors)) {
      return response.errors.map((e: any) => e.message || e).join(', ')
    }

    return 'Erro desconhecido do servidor'
  }
}