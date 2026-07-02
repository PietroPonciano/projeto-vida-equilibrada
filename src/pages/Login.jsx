import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    await auth.login(username, password);
    navigate(from, { replace: true });

  } catch (err) {
    console.error(err);

    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      err.message;

    setError('Falha ao autenticar: ' + message);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-8 tracking-tight">
          Entrar
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <input
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-transparent text-emerald-600 border-2 border-emerald-600 font-semibold py-3.5 rounded-xl transition-all duration-200 hover:bg-emerald-50 active:scale-[0.98]"
            >
              Criar conta
            </button>
            <div className="text-center mt-4">
              <p className="text-gray-600 mb-2">Esqueceu a senha?</p>
              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="w-full bg-transparent text-emerald-600 border-2 border-emerald-600 font-semibold py-3.5 rounded-xl transition-all duration-200 hover:bg-emerald-50 active:scale-[0.98]"
              >
                Redefinir minha senha
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}