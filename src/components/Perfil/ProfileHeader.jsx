import React from 'react';

export default function Header({ perfil, getSaudacao }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-center gap-6">
      <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-inner">
        {perfil?.user?.username?.substring(0, 2).toUpperCase()}
      </div>
      <div className="text-center md:text-left flex-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {getSaudacao()}, {perfil?.user?.username} <span className="inline-block animate-bounce">💸</span>
        </h1>
        <p className="text-slate-500">Membro desde {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}