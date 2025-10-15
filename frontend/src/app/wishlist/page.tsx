export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            Lista de Desejos
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto">
            Guarde seus perfumes favoritos para comprar depois
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Empty State */}
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-black mb-4">
              Sua lista está vazia
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Navegue pela nossa coleção e adicione perfumes à sua lista de desejos 
              clicando no ícone do coração. Assim você pode salvá-los para comprar depois!
            </p>
            <a
              href="/products"
              className="inline-block bg-black text-white px-8 py-4 font-bold text-lg tracking-wide uppercase hover:bg-gray-800 transition-colors duration-200"
            >
              Explorar Perfumes
            </a>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-gray-50 p-8 rounded-lg mt-12">
          <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-tight text-center">
            Como funciona a Lista de Desejos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">1. Favorite</h3>
              <p className="text-gray-600 text-sm">
                Clique no ícone do coração nos perfumes que você gosta
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">2. Organize</h3>
              <p className="text-gray-600 text-sm">
                Todos ficam salvos aqui na sua lista pessoal
              </p>
            </div>

            <div>
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">3. Compre</h3>
              <p className="text-gray-600 text-sm">
                Adicione ao carrinho quando estiver pronto para comprar
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 17H4l5 5v-5z" />
              </svg>
              Acompanhe Promoções
            </h3>
            <p className="text-gray-600 text-sm">
              Receba notificações quando os perfumes da sua lista entrarem em promoção
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Compare Facilmente
            </h3>
            <p className="text-gray-600 text-sm">
              Tenha todos seus favoritos em um lugar só para comparar preços e características
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Presentes Especiais
            </h3>
            <p className="text-gray-600 text-sm">
              Compartilhe sua lista com pessoas queridas para dar dicas de presentes
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
            <h3 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Compra Rápida
            </h3>
            <p className="text-gray-600 text-sm">
              Adicione múltiplos itens ao carrinho de uma vez só quando decidir comprar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Lista de Desejos | Perfumes Importados',
  description: 'Salve seus perfumes favoritos na lista de desejos. Acompanhe promoções e compare produtos facilmente.',
}