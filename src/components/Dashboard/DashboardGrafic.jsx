import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardGrafic({ gastos }) {

  const categoriasCores = {
  Moradia: '#3B82F6',
  Alimentação: '#F59E0B',
  Transporte: '#8B5CF6',
  Saúde: '#EF4444',
  Educação: '#06B6D4',
  Lazer: '#EC4899',
  Investimento: '#10B981',
  Outros: '#94A3B8',
};

  //  AGRUPA POR CATEGORIA
  const dadosGrafico = useMemo(() => {
    const categorias = {};

    gastos.forEach((g) => {
      const categoria = g.categoria || 'Outros';
      const valor = parseFloat(g.valor || 0);

      categorias[categoria] = (categorias[categoria] || 0) + valor;
    });

    return categorias;
  }, [gastos]);

  //  TRANSFORMA EM FORMATO DO CHART
const data = {
  labels: Object.keys(dadosGrafico),
  datasets: [
    {
      data: Object.values(dadosGrafico),
      backgroundColor: Object.keys(dadosGrafico).map(
        (categoria) => categoriasCores[categoria] || '#CBD5E1'
      ),
      borderWidth: 0,
    }
  ]
};

  const options = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  if (!gastos.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-6 text-center text-gray-400">
        Sem dados para o gráfico
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Gastos por Categoria
      </h3>

      <div className="max-w-sm mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}