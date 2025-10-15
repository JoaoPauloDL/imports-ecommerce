export default function HelpPage() {
  const faqs = [
    {
      question: "Os perfumes são 100% originais?",
      answer: "Sim! Todos os nossos perfumes são 100% originais. Trabalhamos apenas com distribuidores autorizados e fornecemos certificado de autenticidade para cada produto."
    },
    {
      question: "Qual o prazo de entrega?",
      answer: "O prazo de entrega varia conforme sua região: Região Sudeste: 3-5 dias úteis, Região Sul: 4-6 dias úteis, Região Nordeste: 5-8 dias úteis, Região Norte: 7-10 dias úteis, Região Centro-Oeste: 5-7 dias úteis."
    },
    {
      question: "Posso trocar ou devolver um produto?",
      answer: "Sim! Você tem até 7 dias após o recebimento para trocar ou devolver qualquer produto, desde que esteja na embalagem original e lacrada. O frete de devolução é por nossa conta."
    },
    {
      question: "A partir de qual valor o frete é grátis?",
      answer: "O frete é grátis para todo o Brasil em compras acima de R$ 300,00. Abaixo deste valor, o frete é calculado conforme o CEP de destino."
    },
    {
      question: "Como posso rastrear meu pedido?",
      answer: "Assim que seu pedido for despachado, você receberá um e-mail com o código de rastreamento. Você também pode acompanhar o status na seção 'Meus Pedidos' da sua conta."
    },
    {
      question: "Quais são as formas de pagamento?",
      answer: "Aceitamos cartões de crédito (Visa, Mastercard, Elo, American Express), cartão de débito, PIX e boleto bancário. O pagamento via PIX tem desconto de 5%."
    },
    {
      question: "Como funciona a garantia?",
      answer: "Todos os produtos têm garantia de qualidade. Se houver qualquer problema com o perfume, fazemos a troca imediatamente. Nossa garantia cobre defeitos de fabricação e produtos danificados no transporte."
    },
    {
      question: "Vocês entregam em todo o Brasil?",
      answer: "Sim! Fazemos entregas para todo o território nacional via Correios e transportadoras parceiras, sempre com código de rastreamento."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase">
            Central de Ajuda
          </h1>
          <p className="text-xl font-light max-w-2xl mx-auto">
            Encontre respostas para as perguntas mais frequentes sobre nossos produtos e serviços
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <a href="/track" className="bg-blue-50 border border-blue-200 p-6 rounded-lg hover:bg-blue-100 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-black mb-2">Rastrear Pedido</h3>
              <p className="text-sm text-gray-600">Acompanhe o status da sua entrega</p>
            </div>
          </a>

          <a href="/returns" className="bg-green-50 border border-green-200 p-6 rounded-lg hover:bg-green-100 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-bold text-black mb-2">Trocas e Devoluções</h3>
              <p className="text-sm text-gray-600">Saiba como trocar ou devolver</p>
            </div>
          </a>

          <a href="/contact" className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-black mb-2">Fale Conosco</h3>
              <p className="text-sm text-gray-600">Tire suas dúvidas direto conosco</p>
            </div>
          </a>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-black text-black mb-8 uppercase tracking-tight text-center">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-black mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-black text-white p-8 rounded-lg mt-16 text-center">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-tight">
            Não encontrou sua resposta?
          </h2>
          <p className="text-gray-300 mb-6">
            Nossa equipe está pronta para ajudar você com qualquer dúvida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 font-bold hover:bg-green-600 transition-colors duration-200"
            >
              WhatsApp
            </a>
            <a
              href="/contact"
              className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              Enviar E-mail
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Central de Ajuda | Perfumes Importados',
  description: 'Encontre respostas para suas dúvidas sobre perfumes importados, entrega, pagamentos, trocas e devoluções. Suporte completo.',
}