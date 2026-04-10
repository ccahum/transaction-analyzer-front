import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTransactionById } from '../api/transactions';
import type { Transaction } from '../api/transactions';
import Navbar from '../components/Navbar';
import CategoryBadge from '../components/CategoryBadge';
import Spinner from '../components/Spinner';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getTransactionById(id)
      .then(setTransaction)
      .catch(() => setError('No se encontró la transacción.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors mb-4"
        >
          ← Volver al Dashboard
        </Link>

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner message="Cargando transacción..." />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-6 text-center">
            {error}
          </div>
        )}

        {!loading && transaction && (
          <div className="flex flex-col gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-white text-xl font-bold">{transaction.description}</h1>
                  <p className="text-slate-400 text-sm mt-1">{transaction.merchant}</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  ${Number(transaction.amount).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <CategoryBadge category={transaction.category} />
                {transaction.isAnomaly ? (
                  <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-full text-xs font-medium">
                    ⚠️ Anomalía detectada
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full text-xs font-medium">
                    ✓ Transacción normal
                  </span>
                )}
                <span className="text-slate-500 text-xs md:ml-auto ml-0">
                  {new Date(transaction.createdAt).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs">AI</span>
                </div>
                <h2 className="text-white font-semibold">Análisis de Gemini AI</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">{transaction.aiSummary}</p>
            </div>

            {transaction.isAnomaly && transaction.anomalyReason && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <h2 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                  ⚠️ Razón de la anomalía
                </h2>
                <p className="text-slate-300 leading-relaxed">{transaction.anomalyReason}</p>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4">
              <h2 className="text-slate-400 text-sm font-medium mb-3 uppercase tracking-wider">
                Información técnica
              </h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-start gap-4 text-sm">
                  <span className="text-slate-400">ID</span>
                  <span className="text-slate-300 font-mono">{transaction.id}</span>
                </div>
                <div className="flex items-center justify-start gap-4 text-sm">
                  <span className="text-slate-400">Categoría</span>
                  <span className="text-slate-300">{transaction.category}</span>
                </div>
                <div className="flex justify-start gap-4 text-sm">
                  <span className="text-slate-400">Es anomalía</span>
                  <span className={transaction.isAnomaly ? 'text-red-400' : 'text-green-400'}>
                    {transaction.isAnomaly ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
