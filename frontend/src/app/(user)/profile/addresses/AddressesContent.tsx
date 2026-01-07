'use client'

import { useState } from 'react'

interface Address {
  id: string
  title: string
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export default function AddressesContent() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      title: 'Casa',
      name: 'João Silva',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      isDefault: true
    },
    {
      id: '2',
      title: 'Trabalho',
      name: 'João Silva',
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      isDefault: false
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowForm(true)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setShowForm(true)
  }

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
    }
  }

  const handleSetDefault = (addressId: string) => {
    setAddresses(prev => 
      prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }))
    )
  }

  const AddressForm = () => (
    <div className="bg-white p-6 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-bold text-black mb-4">
        {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}
      </h3>
      
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Título do Endereço
            </label>
            <input
              type="text"
              placeholder="Ex: Casa, Trabalho, etc."
              defaultValue={editingAddress?.title || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              placeholder="Nome do destinatário"
              defaultValue={editingAddress?.name || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-black mb-1">
              Endereço
            </label>
            <input
              type="text"
              placeholder="Rua, Avenida, etc."
              defaultValue={editingAddress?.street || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Número
            </label>
            <input
              type="text"
              placeholder="123"
              defaultValue={editingAddress?.number || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Complemento
            </label>
            <input
              type="text"
              placeholder="Apto, Bloco, etc. (opcional)"
              defaultValue={editingAddress?.complement || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Bairro
            </label>
            <input
              type="text"
              placeholder="Nome do bairro"
              defaultValue={editingAddress?.neighborhood || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              CEP
            </label>
            <input
              type="text"
              placeholder="00000-000"
              defaultValue={editingAddress?.zipCode || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Cidade
            </label>
            <input
              type="text"
              placeholder="Nome da cidade"
              defaultValue={editingAddress?.city || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Estado
            </label>
            <select 
              defaultValue={editingAddress?.state || ''}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"
            >
              <option value="">Selecione</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              <option value="MG">Minas Gerais</option>
              <option value="RS">Rio Grande do Sul</option>
              <option value="PR">Paraná</option>
              <option value="SC">Santa Catarina</option>
              {/* Add all Brazilian states */}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            defaultChecked={editingAddress?.isDefault || false}
            className="rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="isDefault" className="text-sm text-black">
            Definir como endereço padrão
          </label>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-8 py-3 border border-gray-300 text-black font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            {editingAddress ? 'Salvar Alterações' : 'Adicionar Endereço'}
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Meus Endereços</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus endereços de entrega
          </p>
        </div>
        
        <button
          onClick={handleAddAddress}
          className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Novo Endereço</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && <AddressForm />}

      {/* Addresses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`bg-white p-6 border rounded-lg ${
              address.isDefault ? 'border-black bg-gray-50' : 'border-gray-200'
            }`}
          >
            {/* Address Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-black">{address.title}</h3>
                {address.isDefault && (
                  <span className="bg-black text-white text-xs px-2 py-1 rounded font-medium">
                    PADRÃO
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditAddress(address)}
                  className="p-2 text-gray-400 hover:text-black transition-colors"
                  title="Editar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p className="font-medium text-black">{address.name}</p>
              <p>
                {address.street}, {address.number}
                {address.complement && `, ${address.complement}`}
              </p>
              <p>{address.neighborhood}</p>
              <p>
                {address.city} - {address.state}, {address.zipCode}
              </p>
            </div>

            {/* Actions */}
            {!address.isDefault && (
              <button
                onClick={() => handleSetDefault(address.id)}
                className="text-sm text-black hover:underline font-medium"
              >
                Definir como padrão
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && !showForm && (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="text-lg font-bold text-black mb-2">
            Nenhum endereço cadastrado
          </h3>
          <p className="text-gray-600 mb-6">
            Adicione um endereço para facilitar suas compras
          </p>
          <button
            onClick={handleAddAddress}
            className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors duration-200"
          >
            Adicionar Primeiro Endereço
          </button>
        </div>
      )}
    </div>
  )
}
