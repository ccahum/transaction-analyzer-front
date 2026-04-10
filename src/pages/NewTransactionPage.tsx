import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTransaction } from '../api/transactions';
import Navbar from '../components/Navbar';

export default function NewTransactionPage() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const transaction = await createTransaction({
        description,
        amount: parseFloat(amount),
        merchant,
      });
      navigate(`/transactions/${transaction.id}`);
    } catch {
      setError('Error al crear la transacción. Verifica los datos e intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-4">
          <h1 className="text-white text-2xl font-bold">Nueva transacción</h1>
          <p className="text-slate-400 mt-1 text-sm">
            La IA analizará la transacción automáticamente al crearla.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Descripción</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Compra en supermercado"
                required
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Monto ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Comercio / Proveedor</label>
              <input
                type="text"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Ej: McDonald's"
                required
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-4 text-center">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-indigo-300 text-sm">Analizando con Gemini AI...</p>
                <p className="text-slate-500 text-xs mt-1">Esto puede tardar unos segundos</p>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg py-3 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg py-3 transition-colors"
              >
                {loading ? 'Analizando...' : 'Analizar transacción'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs leading-relaxed">
            <span className="text-indigo-400 font-medium">¿Cómo funciona?</span> — Al crear una
            transacción, Google Gemini AI la analiza para determinar su categoría, generar un resumen
            y detectar si es una anomalía financiera.
          </p>
        </div>
      </main>
    </div>
  );
}
