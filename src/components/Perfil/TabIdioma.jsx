import React from 'react';
import { Check } from 'lucide-react';

export default function TabIdioma({ idioma, handleIdioma }) {
  return (
    <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <h2 className="text-xl font-bold mb-6">Preferências de Exibição</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleIdioma('pt')}
          className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
            idioma === 'pt'
              ? "border-emerald-600 bg-emerald-50"
              : "border-slate-100 hover:border-emerald-200"
          }`}
        >
          <span className="text-4xl">🇧🇷</span>
          <span className="font-bold">Português (Brasil)</span>
          {idioma === 'pt' && <Check size={20} className="text-emerald-600" />}
        </button>

        <button
          disabled
          className="p-6 rounded-3xl border-2 border-slate-50 bg-slate-50 opacity-60 flex flex-col items-center gap-3 cursor-not-allowed"
        >
          <span className="text-4xl grayscale">🇺🇸</span>
          <span className="font-bold text-slate-400">English (Soon)</span>
        </button>
      </div>
    </div>
  );
}