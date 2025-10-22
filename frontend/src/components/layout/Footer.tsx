import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Loja',
      links: [
        { name: 'Produtos', href: '/products' },
        { name: 'Ofertas', href: '/offers' },
        { name: 'Lançamentos', href: '/new-arrivals' },
        { name: 'Categorias', href: '/categories' }
      ]
    },
    {
      title: 'Atendimento',
      links: [
        { name: 'Central de Ajuda', href: '/help' },
        { name: 'Fale Conosco', href: '/contact' },
        { name: 'Trocas e Devoluções', href: '/returns' },
        { name: 'Rastrear Pedido', href: '/track' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Sobre Nós', href: '/about' },
        { name: 'Trabalhe Conosco', href: '/careers' },
        { name: 'Imprensa', href: '/press' },
        { name: 'Sustentabilidade', href: '/sustainability' }
      ]
    },
    {
      title: 'Conta',
      links: [
        { name: 'Minha Conta', href: '/profile' },
        { name: 'Meus Pedidos', href: '/orders' },
        { name: 'Lista de Desejos', href: '/wishlist' },
        { name: 'Endereços', href: '/profile/addresses' }
      ]
    }
  ]

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.987 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.896 3.708 13.745 3.708 12.448c0-1.297.49-2.448 1.297-3.323.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323c0 1.297-.49 2.448-1.297 3.323C10.876 16.498 9.725 16.988 8.449 16.988z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    }
  ]

  const paymentMethods = [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'PIX', logo: '🔄' },
    { name: 'Boleto', logo: '📄' }
  ]

  const securityBadges = [
    { name: 'SSL Seguro', icon: '🔒' },
    { name: 'Site Confiável', icon: '🛡️' },
    { name: 'Loja Protegida', icon: '✅' }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Fique por dentro das novidades!</h3>
            <p className="mb-6 opacity-90">Receba ofertas exclusivas e lançamentos em primeira mão</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Inscrever-se
              </button>
            </div>
            <p className="text-sm opacity-80 mt-3">
              🎁 Ganhe 10% de desconto na primeira compra!
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center mb-4">
                <span className="text-2xl font-bold text-white">Imports Store</span>
              </Link>
              <p className="text-gray-400 mb-4 text-sm">
                Sua loja de produtos importados com qualidade excepcional e os melhores preços do mercado.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">📞 Atendimento</h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>WhatsApp: (11) 99999-9999</p>
                  <p>Email: atendimento@importsstore.com</p>
                  <p>Horário: Seg-Sex 9h às 18h</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🚚 Entrega</h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Frete grátis acima de R$ 500</p>
                  <p>Entrega expressa em 2-5 dias</p>
                  <p>Rastreamento em tempo real</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">🛡️ Garantias</h4>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>30 dias para trocas</p>
                  <p>Garantia oficial</p>
                  <p>Compra 100% segura</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods & Security */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div>
                <h4 className="font-semibold mb-2">Formas de Pagamento</h4>
                <div className="flex space-x-4">
                  {paymentMethods.map((method) => (
                    <div key={method.name} className="flex items-center space-x-1 text-gray-400 text-sm">
                      <span>{method.logo}</span>
                      <span>{method.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Segurança</h4>
                <div className="flex space-x-4">
                  {securityBadges.map((badge) => (
                    <div key={badge.name} className="flex items-center space-x-1 text-gray-400 text-sm">
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 py-4 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <p>&copy; {currentYear} Imports Store. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-4">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Política de Privacidade
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Termos de Uso
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}