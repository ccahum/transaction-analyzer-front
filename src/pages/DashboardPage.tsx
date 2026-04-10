import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions } from '../api/transactions';
import type { Transaction } from '../api/transactions';
import Navbar from '../components/Navbar';
import CategoryBadge from '../components/CategoryBadge';
import Spinner from '../components/Spinner';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => setError('No se pudieron cargar las transacciones.'))
      .finally(() => setLoading(false));
  }, []);

  const totalAmount = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const anomalies = transactions.filter((t) => t.isAnomaly).length;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-6xl mx-auto px-3 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm text-center">Total transacciones</p>
            <p className="text-white text-3xl font-bold mt-1 text-center">{transactions.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm text-center">Monto total</p>
            <p className="text-white text-3xl font-bold mt-1 text-center">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
            <p className="text-slate-400 text-sm text-center">Anomalías detectadas</p>
            <p className={`text-3xl font-bold mt-1 text-center ${anomalies > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {anomalies}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <h2 className="text-white font-semibold">Transacciones recientes</h2>
            <Link
              to="/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Nueva transacción
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <Spinner message="Cargando transacciones..." />
            </div>
          )}

          {error && (
            <div className="text-center py-16">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {!loading && !error && transactions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400 text-lg">No hay transacciones aún.</p>
              <Link to="/new" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                Crear la primera →
              </Link>
            </div>
          )}

          {!loading && transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                    <th className="text-left px-4 py-3 md:px-4">Descripción</th>
                    <th className="hidden md:table-cell text-left px-6 py-3">Comercio</th>
                    <th className="text-left px-4 py-3 md:px-6">Monto</th>
                    <th className="hidden md:table-cell text-left px-6 py-3">Categoría</th>
                    <th className="text-left px-4 py-3 md:px-6">Estado</th>
                    <th className="hidden md:table-cell text-left px-6 py-3">Fecha</th>
                    <th className="px-4 py-3 md:px-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-4 py-4 md:px-4 text-white text-sm max-w-[120px] md:max-w-[200px] truncate">
                        {t.description}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-slate-300 text-sm">{t.merchant}</td>
                      <td className="px-4 py-4 md:px-6 text-white text-sm font-medium">
                        ${Number(t.amount).toFixed(2)}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <CategoryBadge category={t.category} />
                      </td>
                      <td className="px-4 py-4 md:px-6">
                        {t.isAnomaly ? (
                          <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded-full text-xs font-medium">
                            ! <span className="hidden md:inline">Anomalía</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-1 rounded-full text-xs font-medium">
                            ✓ <span className="hidden md:inline">Normal</span>
                          </span>
                        )}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 text-slate-400 text-xs">
                        {new Date(t.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4 md:px-6">
                        <Link
                          to={`/transactions/${t.id}`}
                          className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                        >
                          Ver →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
