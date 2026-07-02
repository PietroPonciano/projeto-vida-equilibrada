import { Wallet, Users, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/index';
import React from 'react';


export default function DashboardCards({
  total,
  salario,
  diferencaReais,
  diferencaPercentual,
  gastoPercentualAtual,
  isFirstMonth
}) {


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

      {/* CARD 1 */}
      <div className="bg-[#66A266] text-white rounded-2xl p-6">
        <h3 className="text-sm opacity-80">Gastos Mensais</h3>

        <p className="text-3xl font-bold mt-2">
          {formatCurrency(total)}
        </p>

        <p className="text-xs mt-2 opacity-90">
          {`${diferencaReais >= 0 ? '↑' : '↓'} ${formatCurrency(Math.abs(diferencaReais))} vs mês anterior`}
        </p>
      </div>

      {/* CARD 2 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-sm text-gray-500">Salário</h3>

        <p className="text-2xl font-bold text-gray-800 mt-2">
          {formatCurrency(salario)}
        </p>

        <p className="text-xs mt-2 text-gray-500">
          {gastoPercentualAtual.toFixed(1)}% comprometido
        </p>
      </div>

      {/* CARD 3 */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="text-sm text-gray-500">% do Salário Gasto</h3>

        <p className="text-2xl font-bold text-gray-800 mt-2">
          {gastoPercentualAtual.toFixed(1)}%
        </p>

        <p className={`text-xs mt-2 font-medium ${
          diferencaPercentual > 0 ? 'text-red-500' : 'text-green-600'
        }`}>
          {isFirstMonth
            ? 'Primeiro mês de uso'
            : `${diferencaPercentual >= 0 ? '▲' : '▼'} ${Math.abs(diferencaPercentual).toFixed(2)}% vs mês anterior`}
        </p>
      </div>

    </div>
  );
}