import React from 'react';
import { ShieldAlert, Trash2 } from 'lucide-react';

export default function TabSeguranca({
  senhaAntiga,
  setSenhaAntiga,
  novaSenha,
  setNovaSenha,
  handleTrocarSenha,
  setModalOpen
}) {
  return (
    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold mb-6">Segurança e Acesso</h2>

      <div className="max-w-md space-y-6">
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Senha antiga"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={senhaAntiga}
            onChange={(e) => setSenhaAntiga(e.target.value)}
          />

          <input
            type="password"
            placeholder="Nova senha"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />

          <button
            onClick={handleTrocarSenha}
            className="w-full bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
          >
            Confirmar Nova Senha
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-rose-600 font-bold flex items-center gap-2 mb-2">
            <ShieldAlert size={18} /> Zona de Perigo
          </h3>

          <p className="text-sm text-slate-500 mb-4">
            Ao desativar sua conta, todos os seus dados serão ocultados permanentemente.
          </p>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 rounded-2xl border border-rose-200 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Desativar minha conta
          </button>
        </div>
      </div>
    </div>
  );
}