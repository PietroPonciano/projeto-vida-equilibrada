import React, { useState, useMemo } from 'react';
import { formatCurrency, formatDate } from '../../utils';
import { CORES_CATEGORIAS, CONFIG_TIPOS } from '../../constants/finance';

export default function DashboardTabela({ gastos }) {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 5;

  const totalPaginas = Math.ceil(gastos.length / itensPorPagina);

  const gastosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return gastos.slice(inicio, inicio + itensPorPagina);
  }, [gastos, paginaAtual]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-600">
          
          {/* HEADER */}
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 text-left">Nome</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4 text-right">Valor</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-50">
            {gastosPaginados.map((gasto) => {
              const cor = CORES_CATEGORIAS[gasto.categoria] || '#CBD5E1';
              const tipo = CONFIG_TIPOS[gasto.tipo] || {};

              return (
                <tr
                  key={gasto.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {gasto.estabelecimento}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(gasto.dataGasto)}
                  </td>

                  {/* TIPO BONITO */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${tipo.badge || 'bg-gray-100 text-gray-500'}`}
                    >
                      {tipo.label || gasto.tipo}
                    </span>
                  </td>

                  {/* CATEGORIA COM COR */}
                  <td className="px-6 py-4">
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-bold border"
                      style={{
                        backgroundColor: `${cor}20`,
                        color: cor,
                        borderColor: `${cor}40`
                      }}
                    >
                      {gasto.categoria}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right font-bold text-gray-900">
                    {formatCurrency(gasto.valor)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {gastos.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">
            Nenhum gasto encontrado
          </div>
        )}
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-center items-center gap-2 p-6 border-t border-gray-100 flex-wrap">
        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
          <button
            key={pagina}
            onClick={() => setPaginaAtual(pagina)}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-all
              ${
                pagina === paginaAtual
                  ? 'bg-green-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
          >
            {pagina}
          </button>
        ))}
      </div>
    </div>
  );
}