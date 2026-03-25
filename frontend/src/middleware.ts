import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware para autenticação e proteção de rotas
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Rotas que precisam de autenticação
  const protectedRoutes = [
    '/profile',
    '/orders'
  ]
  
  // Rotas de admin que precisam de permissão especial
  const adminRoutes = ['/admin']
  
  // Rotas públicas (não precisam autenticação)
  const publicRoutes = ['/checkout', '/cart', '/verify-email']
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Token de autenticação (você pode usar cookies ou headers)
  const token = request.cookies.get('auth-token')?.value
  const userRole = request.cookies.get('user-role')?.value
  
  console.log('🛡️ Middleware - Verificando rota:', pathname)
  console.log('🔑 Middleware - Token presente:', !!token)
  console.log('👤 Middleware - User role:', userRole)
  
  // Se é rota protegida e não tem token, redirecionar para login
  if (isProtectedRoute && !token) {
    console.log('❌ Middleware - Rota protegida sem token, redirecionando para login')
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Se é rota admin e não é admin, redirecionar para home
  if (isAdminRoute && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    console.log('❌ Middleware - Rota admin mas usuário não é admin, redirecionando para home')
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  console.log('✅ Middleware - Acesso liberado para:', pathname)
  
  // Adicionar headers customizados
  const response = NextResponse.next()
  
  // Header para cache de produtos
  if (pathname.startsWith('/products')) {
    response.headers.set('Cache-Control', 'public, max-age=3600')
  }
  
  // Header para segurança
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  
  return response
}

// Configurar em quais rotas o middleware deve rodar
export const config = {
  // Rodar em todas as rotas exceto arquivos estáticos
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg).*)',
  ],
}