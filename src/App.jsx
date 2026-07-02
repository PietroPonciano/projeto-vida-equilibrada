import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { Landmark, Menu, X, LogOut, User } from 'lucide-react';
import api from '../src/services/api';
// ----------------------------
// IMPORTS DAS PÁGINAS
// ----------------------------
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Politics from './pages/Politics'


// ----------------------------
// CONTEXTO DE AUTENTICAÇÃO
// ----------------------------
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  verifica sessão (cookie)
  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me', {
        withCredentials: true
      });
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  //  LOGIN
  const login = async (username, password) => {
    await api.post('/auth/token',
      { username, password },
      { withCredentials: true }
    );

    await checkAuth();
  };

  //  LOGOUT
  const logout = async () => {
    try {
      await api.post('/auth/token/revoke', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext)
}


// ----------------------------
// ROTA PROTEGIDA
// ----------------------------
function Protected({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // ou spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
// ----------------------------
// NAVBAR REFATORADA COM TAILWIND
// ----------------------------
function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para verificar se a rota está ativa
  const isActive = (path) => pathname === path;

  // Classe base para os links
  const getLinkClass = (path) => `
    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${isActive(path)
      ? "bg-emerald-50 text-emerald-700 shadow-sm"
      : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"}
  `;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Lado Esquerdo: Logo e Ícone */}
          <Link to="/" className="flex items-center group transition-transform active:scale-95">
            <div className="bg-emerald-600 p-2 rounded-xl mr-3 shadow-emerald-200 shadow-lg group-hover:rotate-3 transition-transform">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-800">
              Vida<span className="text-emerald-600">Equilibrada</span>
            </span>
          </Link>

          {/* Desktop Navigation (Oculto no Mobile) */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/" className={getLinkClass("/")}>Home</Link>

            {!user ? (
              <div className="flex items-center gap-1 ml-4 border-l pl-4 border-gray-100">
                <Link to="/login" className={getLinkClass("/login")}>Login</Link>
                <Link to="/register" className="ml-2 bg-emerald-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-emerald-200">
                  Criar conta
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Link to="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>




                <div className="flex items-center gap-3 ml-4 border-l pl-4 border-gray-100">
                  <Link to="/perfil" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold">
                      <User />
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Botão Mobile (Oculto no Desktop) */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link onClick={() => setIsMenuOpen(false)} to="/" className={getLinkClass("/")}>Home</Link>
            {!user ? (
              <>
                <Link onClick={() => setIsMenuOpen(false)} to="/login" className={getLinkClass("/login")}>Login</Link>
                <Link onClick={() => setIsMenuOpen(false)} to="/register" className="block text-center mt-4 bg-emerald-600 text-white py-3 rounded-xl font-bold">
                  Criar conta
                </Link>
              </>
            ) : (
              <>
                <Link onClick={() => setIsMenuOpen(false)} to="/dashboard" className={getLinkClass("/dashboard")}>Dashboard</Link>

                <Link onClick={() => setIsMenuOpen(false)} to="/perfil" className={getLinkClass("/perfil")}>Meu Perfil</Link>
                <button
                  onClick={() => { logout(); setIsMenuOpen(false); }}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 py-3 font-bold border border-red-100 rounded-xl"
                >
                  <LogOut className="w-5 h-5" /> Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ----------------------------
// APP PRINCIPAL
// ----------------------------
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Rotas Protegidas */}
              <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />



              <Route path="/perfil" element={<Protected><Profile /></Protected>} />

              <Route path="/politics" element={<Politics />} />

              {/* 404 Estilizado */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <h2 className="text-3xl font-bold text-gray-800">404 - Não encontrado</h2>
                  <p className="text-gray-600 mt-2">A página que você procura não existe ou foi movida.</p>
                  <Link to="/" className="mt-6 text-emerald-600 font-bold hover:underline">Voltar para Home</Link>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}