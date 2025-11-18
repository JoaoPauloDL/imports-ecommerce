import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Páginas estáticas principais
  const routes = [
    '',
    '/products',
    '/about',
    '/contact',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // TODO: Adicionar produtos dinâmicos quando tiver API de listagem
  // Exemplo:
  // const products = await fetch('API_URL/products').then(res => res.json())
  // const productUrls = products.map(product => ({
  //   url: `${baseUrl}/products/${product.slug}`,
  //   lastModified: product.updatedAt,
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }))

  return routes
}
