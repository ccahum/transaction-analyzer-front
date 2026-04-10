import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('El usuario es obligatorio.');
      return;
    }

    if (!password) {
      setError('La contraseña es obligatoria.');
      return;
    }

    if (!confirmPassword) {
      setError('Debes confirmar la contraseña.');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError('El usuario debe tener entre 3 y 20 caracteres.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('El usuario solo puede contener letras, números y guiones bajos.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? 'Error al registrarse');
      }

      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-2">
          <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <img src="/favicon.svg" alt="logo" className="w-16 h-16" />
          </div>
          <h1 className="text-white text-3xl font-bold">Transaction Analyzer</h1>
          <p className="text-slate-400 mt-2">Análisis financiero con Inteligencia Artificial</p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3">
          <h2 className="text-white text-xl font-semibold mb-3 text-center">Crear cuenta</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ej: juan123"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1.5 block">Confirmar contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-2 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-2 transition-colors mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-4">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Inicia sesión
            </Link>
          </p>
        </div>

        <p className="text-slate-500 text-xs text-center mt-3">
          Powered by Google Gemini AI · NestJS · PostgreSQL
        </p>
      </div>
    </div>
  );
}
