export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            Sobre Nós
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto">
            Conheça a história por trás dos melhores perfumes importados do Brasil
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-black text-black mb-6 uppercase tracking-tight">
                Nossa História
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fundada em 2020, a <strong>Perfumes Importados</strong> nasceu da paixão por fragrâncias 
                únicas e exclusivas. Nossa missão é trazer ao Brasil os melhores perfumes do mundo, 
                com garantia de originalidade e os melhores preços do mercado.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Trabalhamos diretamente com distribuidores autorizados nos Estados Unidos, 
                França e Emirados Árabes Unidos para garantir a procedência e qualidade 
                de cada fragrância que chega até você.
              </p>
            </div>
            
            <div className="bg-gray-100 h-96 flex items-center justify-center">
              <span className="text-6xl font-black text-gray-400 tracking-tight uppercase">
                Since 2020
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">100% Originais</h3>
              <p className="text-gray-600 text-sm">
                Todos os nossos perfumes são originais com certificado de autenticidade
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.05l.394 2.764A2 2 0 006.42 11H15a1 1 0 000-2H7.42l-.313-2.207A2 2 0 005.14 5H3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Frete Grátis</h3>
              <p className="text-gray-600 text-sm">
                Entregamos grátis em todo o Brasil para compras acima de R$ 300
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Suporte 24/7</h3>
              <p className="text-gray-600 text-sm">
                Nossa equipe está sempre pronta para te ajudar via WhatsApp
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-black text-black mb-4 uppercase tracking-tight">
              Nossos Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-black mb-2">Qualidade</h3>
                <p className="text-gray-600 text-sm">
                  Selecionamos apenas as melhores fragrâncias de marcas reconhecidas mundialmente.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Confiança</h3>
                <p className="text-gray-600 text-sm">
                  Construímos relacionamentos duradouros baseados na transparência e honestidade.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Inovação</h3>
                <p className="text-gray-600 text-sm">
                  Estamos sempre em busca das últimas tendências e lançamentos do mercado.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Paixão</h3>
                <p className="text-gray-600 text-sm">
                  Cada fragrância é escolhida com carinho para proporcionar experiências únicas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Sobre Nós | Perfumes Importados',
  description: 'Conheça a história da maior loja de perfumes importados do Brasil. Qualidade, originalidade e os melhores preços garantidos.',
}