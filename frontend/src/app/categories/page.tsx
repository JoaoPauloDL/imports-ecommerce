import ThemedHero from '@/components/ThemedHero'

export default function CategoriesPage() {
  const categories = [
    {
      key: 'arabes',
      name: 'Essências Árabes',
      description: 'Aromas intensos e luxuosos do Oriente Médio',
      href: '/products?category=arabes',
      icon: '🏺'
    },
    {
      key: 'franceses', 
      name: 'Perfumes Franceses',
      description: 'Elegância e sofisticação parisiense',
      href: '/products?category=franceses',
      icon: '🥐'
    },
    {
      key: 'masculinos',
      name: 'Masculinos',
      description: 'Fragrâncias marcantes e elegantes',
      href: '/products?category=masculinos',
      icon: '👔'
    },
    {
      key: 'femininos',
      name: 'Femininos', 
      description: 'Delicadeza e sofisticação em cada gota',
      href: '/products?category=femininos',
      icon: '💎'
    },
    {
      key: 'unissex',
      name: 'Unissex',
      description: 'Fragrâncias versáteis para todos',
      href: '/products?category=unissex',
      icon: '⚡'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <ThemedHero 
        title="Categorias" 
        description="Explore nossas categorias e veja como cada uma tem seu próprio tema visual"
      />

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <a
              key={category.key}
              href={category.href}
              className="group bg-white border border-gray-200 rounded-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-2xl font-black text-black mb-3 uppercase tracking-tight">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {category.description}
                </p>
                <div className="inline-flex items-center text-black font-medium group-hover:text-gray-600 transition-colors">
                  Explorar categoria
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">
            🎨 Sistema de Temas Dinâmicos
          </h2>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
            Cada categoria tem sua própria identidade visual! Quando você navegar para uma categoria específica, 
            a interface se adapta automaticamente com cores e elementos que refletem a essência daquela categoria.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="font-bold text-black mb-3">🔄 Mudanças Automáticas</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Cores do header e navegação</li>
                <li>• Gradientes das seções hero</li>
                <li>• Tons dos botões e elementos</li>
                <li>• Indicadores visuais ativos</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="font-bold text-black mb-3">✨ Experiência Visual</h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li>• Transições suaves entre temas</li>                <li>• Cada categoria tem personalidade</li>
                <li>• Interface mais intuitiva</li>
                <li>• Navegação visual aprimorada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Categorias | Perfumes Importados',
  description: 'Explore nossas categorias de perfumes importados com sistema de temas dinâmicos para uma experiência única.',
}