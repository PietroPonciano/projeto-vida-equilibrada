import React from 'react';
import { User, Wallet, Lock, Globe } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {

  const NavItem = ({ id, icon: Icon, label, color = "emerald" }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        activeTab === id
          ? `bg-${color}-600 text-white shadow-lg shadow-${color}-200`
          : "text-slate-600 hover:bg-slate-100"
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  return (
    <aside className="w-full md:w-64 flex flex-col gap-2">
      <NavItem id="geral" icon={User} label="Visão Geral" />
      <NavItem id="financeiro" icon={Wallet} label="Financeiro" />
      <NavItem id="seguranca" icon={Lock} label="Segurança" />
      <NavItem id="idioma" icon={Globe} label="Idioma" />
    </aside>
  );
}