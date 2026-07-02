import React from 'react';
import { Wallet, Check } from 'lucide-react';

export default function TabFinanceiro({ salario, setSalario, handleSalvarSalario }) {
  return (
    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold mb-6">Gestão Financeira</h2>

      <div className="max-w-md">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
          Renda Mensal Estipada
        </label>

        <div className="mt-2 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-500">
            <Wallet size={20} />
          </div>

          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-lg font-bold"
            value={salario}
            onChange={(e) => {
              const numericValue = e.target.value.replace(/\D/g, '');
              const formatted = (Number(numericValue) / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              });
              setSalario(formatted);
            }}
          />
        </div>

        <button
          onClick={handleSalvarSalario}
          className="mt-6 w-full bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Check size={20} /> Atualizar Salário
        </button>
      </div>
    </div>
  );
}