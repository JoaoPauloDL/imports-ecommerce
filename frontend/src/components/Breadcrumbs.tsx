'use client'

import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {/* Item do breadcrumb */}
            {item.href && !item.isActive ? (
              <Link 
                href={item.href}
                className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className={`font-medium ${item.isActive ? 'text-white' : 'text-white/60'}`}>
                {item.label}
              </span>
            )}
            
            {/* Seta separadora - não mostrar no último item */}
            {index < items.length - 1 && (
              <svg 
                className="w-4 h-4 mx-2 text-white/60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Hook para construir breadcrumbs automaticamente
export function useBreadcrumbs() {
  if (typeof window === 'undefined') {
    return []
  }

  const pathname = window.location.pathname
  const searchParams = new URLSearchParams(window.location.search)
  const breadcrumbs: BreadcrumbItem[] = []

  // Home sempre primeiro
  breadcrumbs.push({
    label: 'Home',
    href: '/'
  })

  // Verificar categoria
  const category = searchParams.get('category')
  if (category) {
    breadcrumbs.push({
      label: 'Produtos',
      href: '/products'
    })
    
    // Nome da categoria (capitalizado)
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1)
    breadcrumbs.push({
      label: categoryName,
      isActive: true
    })
  }
  // Verificar filtros especiais
  else if (searchParams.get('filter') === 'sale' || pathname.includes('/offers')) {
    breadcrumbs.push({
      label: 'Ofertas',
      isActive: true
    })
  }
  else if (searchParams.get('filter') === 'new') {
    breadcrumbs.push({
      label: 'Produtos',
      href: '/products'
    })
    breadcrumbs.push({
      label: 'Lançamentos',
      isActive: true
    })
  }
  // Outras páginas
  else if (pathname.includes('/products')) {
    if (searchParams.get('search')) {
      breadcrumbs.push({
        label: 'Produtos',
        href: '/products'
      })
      breadcrumbs.push({
        label: `Busca: "${searchParams.get('search')}"`,
        isActive: true
      })
    } else {
      breadcrumbs.push({
        label: 'Produtos',
        isActive: true
      })
    }
  }
  else if (pathname.includes('/about')) {
    breadcrumbs.push({
      label: 'Sobre Nós',
      isActive: true
    })
  }
  else if (pathname.includes('/contact')) {
    breadcrumbs.push({
      label: 'Contato',
      isActive: true
    })
  }
  else if (pathname.includes('/help')) {
    breadcrumbs.push({
      label: 'Ajuda',
      isActive: true
    })
  }

  return breadcrumbs
}