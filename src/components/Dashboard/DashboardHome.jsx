import DashboardCards from './DashboardCards';
import DashboardGrafic from './DashboardGrafic';
import DashboardTabela from './DashboardTabela';
import React from 'react';

export default function DashboardHome({
  total,
  salario,
  diferencaReais,
  diferencaPercentual,
  gastoPercentualAtual,
  perfil,
  gastos,
  paginaAtual,
  setPaginaAtual,
  totalPaginas,
  isFirstMonth
}) {
  return (
    <>
      <DashboardCards
        total={total}
        salario={salario}
        diferencaReais={diferencaReais}
        diferencaPercentual={diferencaPercentual}
        gastoPercentualAtual={gastoPercentualAtual}
        perfil={perfil}
        gastos={gastos}
        isFirstMonth={isFirstMonth}
      />

      <DashboardGrafic gastos={gastos} />

      <DashboardTabela
        gastos={gastos}
        paginaAtual={paginaAtual}
        setPaginaAtual={setPaginaAtual}
        totalPaginas={totalPaginas}
      />
    </>
  );
}