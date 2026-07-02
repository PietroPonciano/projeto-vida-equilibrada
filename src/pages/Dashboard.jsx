import React, { useEffect, useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';

import Sidebar from '../components/dashboard/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import FormularioGasto from '../components/FormularioGasto';
import TelaPerfil from '../components/TelaPerfil';

import useDashboardData from '../hooks/useDashboardData';

export default function Dashboard() {
  const {
    user,
    perfil,
    stats,
    gastos,
    relatorio,
    relatorioAnterior,
    previsao,
    loading,
    load
  } = useDashboardData();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [abaAtiva, setAbaAtiva] = useState('home');

  const itensPorPagina = 4;

  // =========================
  // PROCESSAMENTO (caso precise)
  // =========================
  const gastosProcessados = useMemo(() => {
    let totalAtual = 0;
    const mesAtualArr = [];

    const hoje = new Date();
    const mes = hoje.getMonth();
    const ano = hoje.getFullYear();

    gastos.forEach((g) => {
      const dataGasto = new Date(g.dataGasto);

      if (
        dataGasto.getMonth() === mes &&
        dataGasto.getFullYear() === ano
      ) {
        const valor = parseFloat(g.valor_real || g.valor || 0);
        mesAtualArr.push(g);
        totalAtual += valor;
      }
    });

    return {
      gastosMesAtual: mesAtualArr.sort(
        (a, b) => new Date(b.dataGasto) - new Date(a.dataGasto)
      ),
      totalGastosAtual: totalAtual
    };
  }, [gastos]);

  const { gastosMesAtual, totalGastosAtual } = gastosProcessados;

  // =========================
  // DADOS NORMALIZADOS
  // =========================
  const salario = Number(perfil?.salario || 0);
  const nome = user?.username || 'Usuário';

  const totalMesAtual = Number(stats?.totalMesAtual || 0);
  const diferencaReais = Number(perfil?.diff_valor_mensal || 0);
  const diferencaPercentual = Number(perfil?.diff_percentual_mensal || 0);

  const gastoPercentualAtual =
    salario > 0 ? (totalGastosAtual / salario) * 100 : 0;

  // =========================
  // PAGINAÇÃO
  // =========================
  const totalPaginas = Math.ceil(gastosMesAtual.length / itensPorPagina);

  const gastosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    return gastosMesAtual.slice(inicio, inicio + itensPorPagina);
  }, [gastosMesAtual, paginaAtual]);

  // =========================
  // LOAD INICIAL
  // =========================
  useEffect(() => {
    load();
  }, [load]);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-emerald-600 mb-4" size={40} />
        <p>Carregando...</p>
      </div>
    );
  }

  // =========================
  // RENDER DINÂMICO
  // =========================
  const renderConteudo = () => {
    switch (abaAtiva) {
      case 'gastos':
        return <FormularioGasto onSuccess={load} />;

      case 'perfil':
        return (
          <TelaPerfil
            nome={nome}
            gastos={gastos}
            relatorio={relatorio}
            relatorioAnterior={relatorioAnterior}
            previsao={previsao}
            reload={load}
          />
        );

      default:
        return (
          <DashboardHome
            total={totalMesAtual}
            salario={salario}
            diferencaReais={diferencaReais}
            diferencaPercentual={diferencaPercentual}
            gastoPercentualAtual={gastoPercentualAtual}
            perfil={perfil}
            gastos={gastosPaginados}
            paginaAtual={paginaAtual}
            setPaginaAtual={setPaginaAtual}
            totalPaginas={totalPaginas}
            isFirstMonth={stats?.isFirstMonth}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        abaAtiva={abaAtiva}
        setAbaAtiva={setAbaAtiva}
      />

      <div className="flex-1 p-6">
        {renderConteudo()}
      </div>
    </div>
  );
}