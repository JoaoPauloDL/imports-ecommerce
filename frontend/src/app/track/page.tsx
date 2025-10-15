export default function TrackPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            Rastrear Pedido
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto">
            Acompanhe o status da sua entrega em tempo real
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Track Form */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-black text-black mb-6 uppercase tracking-tight text-center">
            Digite os dados do seu pedido
          </h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Número do Pedido *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: #12345 ou 67890"
                className="w-full px-4 py-4 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Você encontra o número do pedido no e-mail de confirmação
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">
                E-mail do Pedido *
              </label>
              <input
                type="email"
                required
                placeholder="email@exemplo.com"
                className="w-full px-4 py-4 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200 text-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                O mesmo e-mail usado na compra
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-4 px-8 font-bold text-lg tracking-wide uppercase hover:bg-gray-800 transition-colors duration-200"
            >
              Rastrear Pedido
            </button>
          </form>
        </div>

        {/* Alternative Methods */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-black mb-4">
            Outras formas de rastrear
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <a
              href="/orders"
              className="bg-blue-50 border border-blue-200 p-6 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-black mb-2">Minha Conta</h4>
              <p className="text-sm text-gray-600">
                Veja todos os seus pedidos logado em sua conta
              </p>
            </a>

            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-50 border border-green-200 p-6 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <h4 className="font-bold text-black mb-2">WhatsApp</h4>
              <p className="text-sm text-gray-600">
                Atendimento direto para rastrear seu pedido
              </p>
            </a>
          </div>

          {/* Information Box */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-left">
            <h4 className="font-bold text-black mb-3 flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Informações sobre Rastreamento
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• O código de rastreamento é enviado por e-mail após o despacho</li>
              <li>• Prazo de postagem: até 2 dias úteis após a confirmação do pagamento</li>
              <li>• Entregas são feitas de segunda a sábado (exceto feriados)</li>
              <li>• Para encomendas registradas, é necessária assinatura do recebedor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Rastrear Pedido | Perfumes Importados',
  description: 'Rastreie seu pedido de perfumes importados em tempo real. Digite o número do pedido e acompanhe a entrega.',
}