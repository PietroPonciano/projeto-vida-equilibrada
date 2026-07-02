import React from 'react';
import { Trash2 } from 'lucide-react';

export default function ModalDesativacao({
  senhaConfirmacao,
  setSenhaConfirmacao,
  confirmarDesativacao,
  setModalOpen
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"></div>

      <div className="bg-white w-full max-w-md p-8 rounded-[40px] shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>

          <h3 className="text-2xl font-black text-slate-900">Tem certeza?</h3>
          <p className="text-slate-500 mt-2 font-medium">
            Esta ação requer sua senha para ser processada.
          </p>
        </div>

        <input
          type="password"
          placeholder="Confirme sua senha"
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 outline-none focus:border-rose-500 transition-all text-center text-lg"
          value={senhaConfirmacao}
          onChange={(e) => setSenhaConfirmacao(e.target.value)}
          autoFocus
        />

        <div className="grid grid-cols-1 gap-3 mt-8">
          <button
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 transition-all active:scale-[0.98]"
            onClick={confirmarDesativacao}
          >
            Confirmar e Desativar
          </button>

          <button
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
            onClick={() => setModalOpen(false)}
          >
            Voltar para segurança
          </button>
        </div>
      </div>
    </div>
  );
}