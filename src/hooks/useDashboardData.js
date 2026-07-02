import { useState, useCallback } from 'react';
import api from '../services/api';

export default function useDashboardData() {
  const [data, setData] = useState({
    user: null,
    perfil: null,
    stats: null,
    gastos: [],
    relatorio: null,
    relatorioAnterior: null,
    previsao: null
  });

  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const hoje = new Date();
      const mes = hoje.getMonth() + 1;
      const ano = hoje.getFullYear();
      const dataAnterior = new Date(ano, hoje.getMonth() - 1, 1);

      const [
        resPerfil,
        resGastos,
        resRelatorio,
        resRelatorioAnterior,
        resPrevisao
      ] = await Promise.all([
        api.get('/perfil'),
        api.get('/gastos'),
        api.get(`/relatorio?ano=${ano}&mes=${mes}`),
        api.get(`/relatorio?ano=${dataAnterior.getFullYear()}&mes=${dataAnterior.getMonth() + 1}`),
        api.get('/relatorio/previsao')
      ]);

      const perfilData = resPerfil.data;

      // NORMALIZAÇÃO AQUI
      setData({
        user: perfilData.user,
        perfil: perfilData.perfil,
        stats: perfilData.stats,

        gastos: Array.isArray(resGastos.data) ? resGastos.data : [],

        relatorio: resRelatorio.data,
        relatorioAnterior: resRelatorioAnterior.data,
        previsao: resPrevisao.data
      });

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...data,
    loading,
    load
  };
}