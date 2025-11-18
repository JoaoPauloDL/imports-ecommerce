export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'David Importados',
    description: 'Loja online de produtos importados originais com os melhores preços',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      areaServed: 'BR',
      availableLanguage: 'Portuguese',
    },
    sameAs: [
      // Adicione suas redes sociais aqui
      // 'https://facebook.com/davidimportados',
      // 'https://instagram.com/davidimportados',
    ],
  }
}

export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  sku?: string
  brand?: string
  availability: 'InStock' | 'OutOfStock'
  rating?: number
  reviewCount?: number
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || '',
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Importado',
    },
    offers: {
      '@type': 'Offer',
      url: product.image,
      priceCurrency: 'BRL',
      price: product.price,
      availability: `https://schema.org/${product.availability}`,
      seller: {
        '@type': 'Organization',
        name: 'David Importados',
      },
    },
  }

  // Adicionar ratings se disponível
  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    }
  }

  return schema
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateWebsiteSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'David Importados',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}
