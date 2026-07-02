import React from 'react';
import { User } from 'lucide-react';

export default function TabGeral({ perfil }) {
  return (
    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold mb-6">Informações da Conta</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
            Nome de Usuário
          </label>
          <div className="mt-1 flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-700">
            <User size={20} className="text-slate-400" />
            <span className="font-medium">{perfil?.user?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}