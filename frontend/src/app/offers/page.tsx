import { getThemeByKey } from '@/utils/themes'

export default function OffersPage() {
  const currentTheme = getThemeByKey('ofertas')
  const offers = [
    {
      id: '1',
      name: 'BLEU DE CHANEL',
      slug: 'bleu-de-chanel',
      price: 459.99,
      originalPrice: 529.99,
      image: '/products/bleu-chanel.jpg',
      category: 'masculinos',
      brand: 'Chanel',
      volume: '100ml',
      discount: 13,
      validUntil: '2025-10-31',
      stockStatus: 'in_stock' as const
    },
    {
      id: '2',
      name: 'ANGEL',
      slug: 'angel',
      price: 369.99,
      originalPrice: 429.99,
      image: '/products/angel.jpg',
      category: 'franceses',
      brand: 'Mugler',
      volume: '50ml',
      discount: 14,
      validUntil: '2025-10-25',
      stockStatus: 'in_stock' as const
    },
    {
      id: '3',
      name: 'GOOD GIRL',
      slug: 'good-girl',
      price: 299.99,
      originalPrice: 389.99,
      image: '/products/good-girl.jpg',
      category: 'femininos',
      brand: 'Carolina Herrera',
      volume: '80ml',
      discount: 23,
      validUntil: '2025-11-15',
      stockStatus: 'low_stock' as const
    },
    {
      id: '4',
      name: 'INVICTUS',
      slug: 'invictus',
      price: 249.99,
      originalPrice: 329.99,
      image: '/products/invictus.jpg',
      category: 'masculinos',
      brand: 'Paco Rabanne',
      volume: '100ml',
      discount: 24,
      validUntil: '2025-10-20',
      stockStatus: 'in_stock' as const
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${currentTheme.primary} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase">
            Ofertas Especiais
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto mb-8">
            Perfumes originais com até 30% de desconto por tempo limitado
          </p>
          
          {/* Countdown or Promotional Badge */}
          <div className={`inline-flex items-center bg-white ${currentTheme.text} px-6 py-3 font-bold text-lg uppercase tracking-wide`}>
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ofertas por Tempo Limitado
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">
            Descontos Imperdíveis
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Aproveite os melhores preços em perfumes importados originais. 
            Ofertas válidas enquanto durarem os estoques.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {offers.map((product) => (
            <div key={product.id} className="group relative bg-white border border-gray-200 hover:border-black transition-colors duration-300">
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase">
                  -{product.discount}%
                </span>
              </div>

              {/* Stock Badge */}
              {product.stockStatus === 'low_stock' && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-orange-500 text-white px-3 py-1 text-xs font-bold uppercase">
                    Últimas Unidades
                  </span>
                </div>
              )}

              {/* Product Image */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl font-bold">
                  {product.brand.charAt(0)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  {product.brand} • {product.volume}
                </p>
                <h3 className="text-lg font-bold text-black mb-3 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                
                {/* Prices */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-black text-black">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Valid Until */}
                <p className="text-xs text-red-600 font-medium mb-4">
                  Válida até {new Date(product.validUntil).toLocaleDateString('pt-BR')}
                </p>

                {/* Actions */}
                <div className="space-y-3">
                  <button className="w-full bg-black text-white py-3 px-6 font-medium hover:bg-gray-800 transition-colors duration-200 uppercase text-sm tracking-wide">
                    Adicionar ao Carrinho
                  </button>
                  <a
                    href={`/products/${product.slug}`}
                    className="block w-full text-center border border-black text-black py-3 px-6 font-medium hover:bg-black hover:text-white transition-colors duration-200 uppercase text-sm tracking-wide"
                  >
                    Ver Detalhes
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-black text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">
            Não Perca Nenhuma Oferta
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Cadastre-se em nossa newsletter e seja o primeiro a saber sobre promoções exclusivas, 
            lançamentos e ofertas relâmpago.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 text-black focus:outline-none"
            />
            <button className="bg-red-600 text-white px-8 py-4 font-bold text-sm tracking-wide uppercase hover:bg-red-700 transition-colors duration-200">
              Cadastrar
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h3 className="font-bold text-black mb-4">Termos e Condições das Ofertas</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Ofertas válidas enquanto durarem os estoques</li>
            <li>• Descontos não cumulativos com outras promoções</li>
            <li>• Preços podem sofrer alterações sem aviso prévio</li>
            <li>• Frete grátis para compras acima de R$ 300,00</li>
            <li>• Produtos sujeitos à disponibilidade</li>
            <li>• Garantia de originalidade em todos os produtos</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Ofertas Especiais | Perfumes Importados',
  description: 'Perfumes importados originais com até 30% de desconto. Ofertas por tempo limitado das melhores marcas mundiais.',
}