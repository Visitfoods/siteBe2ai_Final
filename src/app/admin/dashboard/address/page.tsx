'use client';

import { useState, useEffect } from 'react';
import { Address, getAddress, updateAddress } from '@/lib/firebase/firebaseUtils';
import { MapPin } from 'lucide-react';

export default function AddressPage() {
  const [address, setAddress] = useState<Omit<Address, 'id'>>({
    street: '',
    number: '',
    city: '',
    zipCode: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    try {
      const data = await getAddress();
      if (data) {
        const { id, ...addressData } = data;
        setAddress(addressData);
      }
    } catch (error) {
      console.error('Erro ao carregar endereço:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setShowSuccess(false);

    try {
      await updateAddress(address);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Gerenciar Endereço</h1>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-white/80" />
          <h2 className="text-lg font-medium text-white">Endereço da Empresa</h2>
        </div>

        {showSuccess && (
          <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded mb-6">
            Endereço atualizado com sucesso!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Rua
            </label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Número
              </label>
              <input
                type="text"
                name="number"
                value={address.number}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Código Postal
            </label>
            <input
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white rounded focus:outline-none focus:border-white/20"
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors rounded disabled:opacity-50 ${
                saving ? 'cursor-not-allowed' : ''
              }`}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 