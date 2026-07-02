import React from 'react';
import { Home, FileUp, FileBarChart } from 'lucide-react';


export default function Sidebar({ abaAtiva, setAbaAtiva }) {
  return (
    <aside className="w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 shadow-sm z-10">
      <div
        onClick={() => setAbaAtiva('home')}
        className={`p-3 rounded-xl mb-8 cursor-pointer transition-all ${
          abaAtiva === 'home'
            ? 'bg-green-600 text-white shadow-lg shadow-green-200'
            : 'text-gray-400 hover:text-gray-700'
        }`}
      >
        <Home className="w-6 h-6" />
      </div>

      <div className="flex flex-col space-y-6">
        <div
          onClick={() => setAbaAtiva('gastos')}
          className={`p-3 rounded-xl cursor-pointer ${
            abaAtiva === 'gastos'
              ? 'bg-green-600 text-white'
              : 'text-gray-400'
          }`}
        >
          <FileUp className="w-6 h-6" />
        </div>

        <div
          onClick={() => setAbaAtiva('perfil')}
          className={`p-3 rounded-xl cursor-pointer ${
            abaAtiva === 'perfil'
              ? 'bg-green-600 text-white'
              : 'text-gray-400'
          }`}
        >
          <FileBarChart className="w-6 h-6" />
        </div>
      </div>
    </aside>
  );
}