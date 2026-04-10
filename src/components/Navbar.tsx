import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-700 px-4 py-4 md:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img src="/favicon.svg" alt="logo" className="w-16 h-16" />
          </div>
          <span className="hidden md:block text-white font-semibold text-lg">Transaction Analyzer</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="hidden md:block text-slate-400 hover:text-white transition-colors text-sm"
          >
            Transacciones
          </Link>
          <Link
            to="/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 md:px-4 rounded-lg text-sm font-medium transition-colors"
            style={{ padding: '0.1rem .5rem' }}
          >
            + Nueva
          </Link>
          <div className="hidden md:flex items-center gap-2 border-l border-slate-700 pl-3">
            <span className="text-slate-500 text-sm">👤</span>
            <span className="text-slate-300 text-sm font-medium">{username}</span>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition-colors text-sm"
            >
              · Salir
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden text-slate-400 hover:text-red-400 transition-colors text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
