'use client'



import { useState, useEffect } from 'react'import { useState } from 'react'

import { useRouter } from 'next/navigation'

import Link from 'next/link'interface Address {

import { useAuthStore } from '@/store/authStore'  id: string

  title: string

interface Address {  name: string

  id: string  street: string

  street: string  number: string

  number: string  complement?: string

  complement: string | null  neighborhood: string

  neighborhood: string  city: string

  city: string  state: string

  state: string  zipCode: string

  zipCode: string  isDefault: boolean

  isDefault: boolean}

}

export default function AddressesContent() {

export default function AddressesContent() {  const [addresses, setAddresses] = useState<Address[]>([

  const router = useRouter()    {

  const { user, token } = useAuthStore()      id: '1',

        title: 'Casa',

  const [addresses, setAddresses] = useState<Address[]>([])      name: 'João Silva',

  const [loading, setLoading] = useState(true)      street: 'Rua das Flores',

  const [showModal, setShowModal] = useState(false)      number: '123',

  const [editingAddress, setEditingAddress] = useState<Address | null>(null)      complement: 'Apto 45',

  const [loadingCep, setLoadingCep] = useState(false)      neighborhood: 'Centro',

        city: 'São Paulo',

  const [formData, setFormData] = useState({      state: 'SP',

    street: '',      zipCode: '01234-567',

    number: '',      isDefault: true

    complement: '',    },

    neighborhood: '',    {

    city: '',      id: '2',

    state: '',      title: 'Trabalho',

    zipCode: '',      name: 'João Silva',

    isDefault: false      street: 'Av. Paulista',

  })      number: '1000',

      neighborhood: 'Bela Vista',

  useEffect(() => {      city: 'São Paulo',

    if (!user || !token) {      state: 'SP',

      router.push('/login')      zipCode: '01310-100',

      return      isDefault: false

    }    }

    fetchAddresses()  ])

  }, [user, token])

  const [showForm, setShowForm] = useState(false)

  const fetchAddresses = async () => {  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    try {

      setLoading(true)  const handleAddAddress = () => {

      const response = await fetch(`http://localhost:5000/api/addresses/user/${user?.id}`, {    setEditingAddress(null)

        headers: {    setShowForm(true)

          Authorization: `Bearer ${token}`  }

        }

      })  const handleEditAddress = (address: Address) => {

          setEditingAddress(address)

      if (!response.ok) throw new Error('Erro ao buscar endereços')    setShowForm(true)

        }

      const data = await response.json()

      setAddresses(data)  const handleDeleteAddress = (addressId: string) => {

    } catch (error) {    if (confirm('Tem certeza que deseja excluir este endereço?')) {

      console.error('Erro:', error)      setAddresses(prev => prev.filter(addr => addr.id !== addressId))

      alert('Erro ao carregar endereços')    }

    } finally {  }

      setLoading(false)

    }  const handleSetDefault = (addressId: string) => {

  }    setAddresses(prev => 

      prev.map(addr => ({

  const fetchAddressByCep = async (cep: string) => {        ...addr,

    const cleanCep = cep.replace(/\D/g, '')        isDefault: addr.id === addressId

    if (cleanCep.length !== 8) return      }))

        )

    try {  }

      setLoadingCep(true)

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)  const AddressForm = () => (

      const data = await response.json()    <div className="bg-white p-6 border border-gray-200 rounded-lg">

            <h3 className="text-lg font-bold text-black mb-4">

      if (data.erro) {        {editingAddress ? 'Editar Endereço' : 'Novo Endereço'}

        alert('CEP não encontrado')      </h3>

        return      

      }      <form className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      setFormData(prev => ({          <div>

        ...prev,            <label className="block text-sm font-medium text-black mb-1">

        street: data.logradouro || '',              Título do Endereço

        neighborhood: data.bairro || '',            </label>

        city: data.localidade || '',            <input

        state: data.uf || ''              type="text"

      }))              placeholder="Ex: Casa, Trabalho, etc."

    } catch (error) {              defaultValue={editingAddress?.title || ''}

      console.error('Erro ao buscar CEP:', error)              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

    } finally {            />

      setLoadingCep(false)          </div>

    }          

  }          <div>

            <label className="block text-sm font-medium text-black mb-1">

  const handleSubmit = async (e: React.FormEvent) => {              Nome Completo

    e.preventDefault()            </label>

                <input

    try {              type="text"

      const url = editingAddress              placeholder="Nome do destinatário"

        ? `http://localhost:5000/api/addresses/${editingAddress.id}`              defaultValue={editingAddress?.name || ''}

        : 'http://localhost:5000/api/addresses'              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

                  />

      const method = editingAddress ? 'PUT' : 'POST'          </div>

              </div>

      const response = await fetch(url, {

        method,        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        headers: {          <div className="md:col-span-2">

          'Content-Type': 'application/json',            <label className="block text-sm font-medium text-black mb-1">

          Authorization: `Bearer ${token}`              Endereço

        },            </label>

        body: JSON.stringify({            <input

          ...formData,              type="text"

          userId: user?.id              placeholder="Rua, Avenida, etc."

        })              defaultValue={editingAddress?.street || ''}

      })              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

                  />

      if (!response.ok) {          </div>

        const error = await response.json()          

        throw new Error(error.error || 'Erro ao salvar endereço')          <div>

      }            <label className="block text-sm font-medium text-black mb-1">

                    Número

      await fetchAddresses()            </label>

      handleCloseModal()            <input

      alert(editingAddress ? 'Endereço atualizado!' : 'Endereço adicionado!')              type="text"

    } catch (error: any) {              placeholder="123"

      console.error('Erro:', error)              defaultValue={editingAddress?.number || ''}

      alert(error.message || 'Erro ao salvar endereço')              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

    }            />

  }          </div>

        </div>

  const handleDelete = async (id: string) => {

    if (!confirm('Deseja realmente excluir este endereço?')) return        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>

    try {            <label className="block text-sm font-medium text-black mb-1">

      const response = await fetch(`http://localhost:5000/api/addresses/${id}`, {              Complemento

        method: 'DELETE',            </label>

        headers: {            <input

          Authorization: `Bearer ${token}`              type="text"

        }              placeholder="Apto, Bloco, etc. (opcional)"

      })              defaultValue={editingAddress?.complement || ''}

                    className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

      if (!response.ok) throw new Error('Erro ao excluir endereço')            />

                </div>

      await fetchAddresses()          

      alert('Endereço excluído!')          <div>

    } catch (error) {            <label className="block text-sm font-medium text-black mb-1">

      console.error('Erro:', error)              Bairro

      alert('Erro ao excluir endereço')            </label>

    }            <input

  }              type="text"

              placeholder="Nome do bairro"

  const handleEdit = (address: Address) => {              defaultValue={editingAddress?.neighborhood || ''}

    setEditingAddress(address)              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

    setFormData({            />

      street: address.street,          </div>

      number: address.number,        </div>

      complement: address.complement || '',

      neighborhood: address.neighborhood,        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

      city: address.city,          <div>

      state: address.state,            <label className="block text-sm font-medium text-black mb-1">

      zipCode: address.zipCode,              CEP

      isDefault: address.isDefault            </label>

    })            <input

    setShowModal(true)              type="text"

  }              placeholder="00000-000"

              defaultValue={editingAddress?.zipCode || ''}

  const handleCloseModal = () => {              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

    setShowModal(false)            />

    setEditingAddress(null)          </div>

    setFormData({          

      street: '',          <div>

      number: '',            <label className="block text-sm font-medium text-black mb-1">

      complement: '',              Cidade

      neighborhood: '',            </label>

      city: '',            <input

      state: '',              type="text"

      zipCode: '',              placeholder="Nome da cidade"

      isDefault: false              defaultValue={editingAddress?.city || ''}

    })              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

  }            />

          </div>

  if (loading) {          

    return (          <div>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center">            <label className="block text-sm font-medium text-black mb-1">

        <div className="text-center">              Estado

          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>            </label>

          <p className="text-gray-600">Carregando...</p>            <select 

        </div>              defaultValue={editingAddress?.state || ''}

      </div>              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black transition-colors duration-200"

    )            >

  }              <option value="">Selecione</option>

              <option value="SP">São Paulo</option>

  return (              <option value="RJ">Rio de Janeiro</option>

    <div className="min-h-screen bg-gray-50 py-8">              <option value="MG">Minas Gerais</option>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">              <option value="RS">Rio Grande do Sul</option>

        {/* Header */}              <option value="PR">Paraná</option>

        <div className="mb-8">              <option value="SC">Santa Catarina</option>

          <Link href="/profile" className="text-blue-600 hover:underline mb-4 inline-block">              {/* Add all Brazilian states */}

            ← Voltar ao Perfil            </select>

          </Link>          </div>

          <div className="flex justify-between items-center">        </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">Meus Endereços</h1>        <div className="flex items-center space-x-2">

              <p className="text-gray-600 mt-2">Gerencie seus endereços de entrega</p>          <input

            </div>            type="checkbox"

            <button            id="isDefault"

              onClick={() => setShowModal(true)}            defaultChecked={editingAddress?.isDefault || false}

              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"            className="rounded border-gray-300 text-black focus:ring-black"

            >          />

              Adicionar Endereço          <label htmlFor="isDefault" className="text-sm text-black">

            </button>            Definir como endereço padrão

          </div>          </label>

        </div>        </div>



        {/* Lista de Endereços */}        <div className="flex space-x-4 pt-4">

        {addresses.length === 0 ? (          <button

          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">            type="button"

            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">            onClick={() => setShowForm(false)}

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />            className="px-8 py-3 border border-gray-300 text-black font-medium hover:bg-gray-50 transition-colors duration-200"

            </svg>          >

            <h3 className="text-lg font-medium text-gray-900 mb-2">            Cancelar

              Nenhum endereço cadastrado          </button>

            </h3>          <button

            <p className="text-gray-500 mb-6">            type="submit"

              Adicione um endereço para facilitar suas compras            className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors duration-200"

            </p>          >

            <button            {editingAddress ? 'Salvar Alterações' : 'Adicionar Endereço'}

              onClick={() => setShowModal(true)}          </button>

              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"        </div>

            >      </form>

              Adicionar Primeiro Endereço    </div>

            </button>  )

          </div>

        ) : (  return (

          <div className="grid gap-4">    <div className="space-y-6">

            {addresses.map((address) => (      {/* Header */}

              <div      <div className="flex items-center justify-between">

                key={address.id}        <div>

                className="bg-white rounded-lg shadow-sm border p-6 relative"          <h1 className="text-2xl font-bold text-black">Meus Endereços</h1>

              >          <p className="text-gray-600 mt-1">

                {address.isDefault && (            Gerencie seus endereços de entrega

                  <div className="absolute top-4 right-4">          </p>

                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">        </div>

                      Padrão        

                    </span>        <button

                  </div>          onClick={handleAddAddress}

                )}          className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center space-x-2"

                        >

                <div className="pr-20">          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                  <p className="font-medium text-gray-900">            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />

                    {address.street}, {address.number}          </svg>

                    {address.complement && ` - ${address.complement}`}          <span>Novo Endereço</span>

                  </p>        </button>

                  <p className="text-gray-600 mt-1">      </div>

                    {address.neighborhood} - {address.city}/{address.state}

                  </p>      {/* Add/Edit Form */}

                  <p className="text-gray-600">      {showForm && <AddressForm />}

                    CEP: {address.zipCode}

                  </p>      {/* Addresses List */}

                </div>      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {addresses.map((address) => (

                <div className="flex gap-2 mt-4">          <div

                  <button            key={address.id}

                    onClick={() => handleEdit(address)}            className={`bg-white p-6 border rounded-lg ${

                    className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"              address.isDefault ? 'border-black bg-gray-50' : 'border-gray-200'

                  >            }`}

                    Editar          >

                  </button>            {/* Address Header */}

                  <button            <div className="flex items-center justify-between mb-4">

                    onClick={() => handleDelete(address.id)}              <div className="flex items-center space-x-2">

                    className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"                <h3 className="font-bold text-black">{address.title}</h3>

                  >                {address.isDefault && (

                    Excluir                  <span className="bg-black text-white text-xs px-2 py-1 rounded font-medium">

                  </button>                    PADRÃO

                </div>                  </span>

              </div>                )}

            ))}              </div>

          </div>              

        )}              <div className="flex items-center space-x-2">

                <button

        {/* Modal de Adicionar/Editar */}                  onClick={() => handleEditAddress(address)}

        {showModal && (                  className="p-2 text-gray-400 hover:text-black transition-colors"

          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">                  title="Editar"

            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">                >

              <div className="p-6 border-b">                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                <h2 className="text-xl font-semibold text-gray-900">                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />

                  {editingAddress ? 'Editar Endereço' : 'Adicionar Endereço'}                  </svg>

                </h2>                </button>

              </div>                <button

                                onClick={() => handleDeleteAddress(address.id)}

              <form onSubmit={handleSubmit} className="p-6 space-y-4">                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"

                {/* CEP */}                  title="Excluir"

                <div>                >

                  <label className="block text-sm font-medium text-gray-700 mb-2">                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">

                    CEP *                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />

                  </label>                  </svg>

                  <input                </button>

                    type="text"              </div>

                    required            </div>

                    value={formData.zipCode}

                    onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}            {/* Address Details */}

                    onBlur={(e) => fetchAddressByCep(e.target.value)}            <div className="space-y-1 text-sm text-gray-600 mb-4">

                    placeholder="00000-000"              <p className="font-medium text-black">{address.name}</p>

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"              <p>

                  />                {address.street}, {address.number}

                  {loadingCep && <p className="text-sm text-blue-600 mt-1">Buscando CEP...</p>}                {address.complement && `, ${address.complement}`}

                </div>              </p>

              <p>{address.neighborhood}</p>

                {/* Rua */}              <p>

                <div>                {address.city} - {address.state}, {address.zipCode}

                  <label className="block text-sm font-medium text-gray-700 mb-2">              </p>

                    Rua *            </div>

                  </label>

                  <input            {/* Actions */}

                    type="text"            {!address.isDefault && (

                    required              <button

                    value={formData.street}                onClick={() => handleSetDefault(address.id)}

                    onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}                className="text-sm text-black hover:underline font-medium"

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"              >

                  />                Definir como padrão

                </div>              </button>

            )}

                {/* Número e Complemento */}          </div>

                <div className="grid grid-cols-2 gap-4">        ))}

                  <div>      </div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                      Número *      {/* Empty State */}

                    </label>      {addresses.length === 0 && !showForm && (

                    <input        <div className="text-center py-12">

                      type="text"          <svg

                      required            className="w-16 h-16 text-gray-400 mx-auto mb-4"

                      value={formData.number}            fill="none"

                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}            stroke="currentColor"

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"            viewBox="0 0 24 24"

                    />          >

                  </div>            <path

                  <div>              strokeLinecap="round"

                    <label className="block text-sm font-medium text-gray-700 mb-2">              strokeLinejoin="round"

                      Complemento              strokeWidth={1}

                    </label>              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"

                    <input            />

                      type="text"            <path

                      value={formData.complement}              strokeLinecap="round"

                      onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))}              strokeLinejoin="round"

                      placeholder="Apto, bloco..."              strokeWidth={1}

                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"

                    />            />

                  </div>          </svg>

                </div>          <h3 className="text-lg font-bold text-black mb-2">

            Nenhum endereço cadastrado

                {/* Bairro */}          </h3>

                <div>          <p className="text-gray-600 mb-6">

                  <label className="block text-sm font-medium text-gray-700 mb-2">            Adicione um endereço para facilitar suas compras

                    Bairro *          </p>

                  </label>          <button

                  <input            onClick={handleAddAddress}

                    type="text"            className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors duration-200"

                    required          >

                    value={formData.neighborhood}            Adicionar Primeiro Endereço

                    onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}          </button>

                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"        </div>

                  />      )}

                </div>    </div>

  )

                {/* Cidade e Estado */}}

                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UF *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
                      placeholder="SP"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Endereço Padrão */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Definir como endereço padrão
                  </label>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    {editingAddress ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
