import React, { useState, useEffect, useCallback, useMemo } from 'react';

// services
import api from '../services/api';

// utils
import { formatCurrency, formatDate } from '../utils/index';

// constants
import { CATEGORIAS, TIPOS_GASTO_LISTA, CONFIG_TIPOS } from '../constants/finance';

// components
import CategoryBadge from './CategoryBadge';

// icons
import {
    RefreshCw,
    Calendar,
    ChevronRight,
    TrendingUp,
    Sparkles,
    Lightbulb,
    Rocket,
    FileDown,
    Search,
    Edit2,
    Trash2,
    Save,
    X
} from 'lucide-react';

// charts
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Cell
} from 'recharts';


function TelaPerfil({
  nome,
  gastos = [],
  relatorio,
  relatorioAnterior,
  previsao,
  reload
}) {
    const [abaAtiva, setAbaAtiva] = useState('resumo');
    const [busca, setBusca] = useState('');
    const [editandoGasto, setEditandoGasto] = useState(null);
    const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
    const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
    const loading = !relatorio || !previsao;




const gastosFiltrados = useMemo(() => {
  return gastos.filter(g =>
    (g.estabelecimento || '').toLowerCase().includes(busca.toLowerCase()) ||
    (g.categoria || '').toLowerCase().includes(busca.toLowerCase()) ||
    String(g.valor || '').includes(busca)
  );
}, [gastos, busca]);

    const gerarPDF = async () => {
        try {
            const mes = String(mesAtual).padStart(2, '0');

            const response = await api.get(
                `/relatorio/pdf/${anoAtual}/${mes}`,
                {
                    responseType: 'blob', // ESSENCIAL
                }
            );

            const url = window.URL.createObjectURL(response.data);

            const a = document.createElement('a');
            a.href = url;
            a.download = `relatorio_Vida_Equilibrada_${mes}_${anoAtual}.pdf`;

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert('Erro ao baixar relatório');
        }
    };

    const handleUpdateGasto = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/gastos/${editandoGasto.id}`, editandoGasto);

            setEditandoGasto(null);
            reload();

        } catch (err) {
            alert("Erro ao atualizar gasto");
        }
    };

    const handleDeleteGasto = async (id) => {
        if (!confirm("Deseja excluir este registro?")) return;

        try {
            await api.delete(`/gastos/${id}`);
            reload();

        } catch (err) {
            alert("Erro ao excluir");
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <RefreshCw className="animate-spin text-emerald-600 mb-4" size={40} />
            <p className="text-slate-500 animate-pulse font-medium">Carregando...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Olá, {nome}</h2>
                    <p className="text-slate-500 font-medium">Você gastou <span className="text-emerald-600 font-bold">R$ {Number(relatorio?.total || 0).toFixed(2)}</span> este mês.</p>
                </div>
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setAbaAtiva('resumo')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${abaAtiva === 'resumo' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Resumo Mensal
                    </button>
                    <button
                        onClick={() => setAbaAtiva('historico')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${abaAtiva === 'historico' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Histórico
                    </button>
                </div>
            </header>

            {abaAtiva === 'resumo' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Calendar size={20} /></div>
                                    Desempenho Mensal
                                </h3>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={[
                                        { name: 'Mês Anterior', total: Number(relatorioAnterior?.total || 0) },
                                        { name: 'Mês Atual', total: Number(relatorio?.total || 0) }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none' }} />
                                        <Bar dataKey="total" radius={[10, 10, 0, 0]} barSize={60}>
                                            <Cell fill="#507447" />
                                            <Cell fill="#008111" />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </section>

                        <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-800">Atividades Recentes</h3>
                                <button onClick={() => setAbaAtiva('historico')} className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                    Ver tudo <ChevronRight size={16} />
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estabelecimento</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoria</th>
                                            <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {gastos.slice(0, 5).map((g) => (
                                            <tr key={g.id} className="hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-slate-700">{g.estabelecimento}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium">{formatDate(g.dataGasto)}</p>
                                                </td>
                                                <td className="px-8 py-5"><CategoryBadge categoria={g.categoria} /></td>
                                                <td className="px-8 py-5 text-right font-black text-slate-800">{formatCurrency(g.valor)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl shadow-emerald-100 text-white relative overflow-hidden">
                            <div className="relative z-10">

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="font-bold text-lg">Previsão do Mês</h3>
                                </div>

                                {/* Valor principal */}
                                <p className="text-4xl font-black mb-1">
                                    {formatCurrency(previsao?.totalPrevisto)}
                                </p>

                                {/* Mensagem IA */}
                                <p className="text-emerald-100 text-sm mb-4">
                                    {previsao?.resumo?.mensagem || 'Estimativa baseada no seu histórico'}
                                </p>

                                {/* Linha divisória suave */}
                                <div className="h-px bg-white/10 my-4" />

                                {/* Impacto */}
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-100 text-sm">
                                        Desempenho no período
                                    </span>

                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${previsao?.resumo?.impacto_percentual > 0
                                        ? 'bg-red-500/20 text-red-100'
                                        : previsao?.resumo?.impacto_percentual < 0
                                            ? 'bg-emerald-400/20 text-emerald-100'
                                            : 'bg-white/20 text-white'
                                        }`}>
                                        {previsao?.resumo?.impacto_percentual != null
                                            ? `${previsao.resumo.impacto_percentual > 0 ? '+' : ''
                                            }${previsao.resumo.impacto_percentual
                                                .toFixed(2)
                                                .replace('.', ',')}%`
                                            : '--'}
                                    </span>
                                </div>

                            </div>

                            {/* Ícone decorativo */}
                            <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                                <TrendingUp size={160} />
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                                <Sparkles className="text-emerald-500" size={18} />
                                Análise Inteligente
                            </h3>

                            {/* INSIGHTS */}
                            {previsao?.insights?.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">
                                        <Lightbulb size={16} className='text-yellow-600' />
                                        Insights
                                    </h4>

                                    <div className="space-y-3">
                                        {previsao.insights.map((insight, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-2xl border flex items-start gap-3 transition-all
                 bg-yellow-50 border-yellow-200 hover:shadow-sm"
                                            >
                                                <div className="mt-0.5 text-yellow-600">
                                                    <Lightbulb size={16} />
                                                </div>

                                                <p className="text-sm font-medium leading-relaxed text-yellow-800">
                                                    {insight}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SUGESTÕES */}
                            {previsao?.sugestoes?.length > 0 && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase mb-3 tracking-wider">
                                        <Rocket size={16} className='text-blue-600' />
                                        Sugestões
                                    </h4>

                                    <div className="space-y-3">
                                        {previsao.sugestoes.map((sugestao, index) => (
                                            <div
                                                key={index}
                                                className="p-4 rounded-2xl border border-blue-100 bg-blue-50 flex items-start gap-3 transition-all hover:scale-[1.01]"
                                            >
                                                <div className="text-blue-600 mt-0.5">
                                                    <Rocket size={16} />
                                                </div>

                                                <p className="text-sm font-medium text-blue-800 leading-relaxed">
                                                    {sugestao}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                        <button onClick={gerarPDF} className="w-full bg-slate-800 text-white p-6 rounded-[2rem] font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-lg shadow-slate-200">
                            <FileDown size={20} /> Exportar Relatório PDF
                        </button>
                    </div>
                </div>
            ) : (
                <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-xl font-black text-slate-800">Histórico Completo</h3>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text" placeholder="Buscar por estabelecimento..."
                                className="pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 w-full md:w-80 text-sm font-medium"
                                value={busca} onChange={e => setBusca(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Data</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Estabelecimento</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Categoria</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Valor</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {gastosFiltrados.map((g) => (
                                    <tr key={g.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="px-8 py-5 text-sm font-medium text-slate-400">{formatDate(g.dataGasto)}</td>
                                        <td className="px-8 py-5 font-bold text-slate-700">{g.estabelecimento}</td>
                                        <td className="px-8 py-5"><CategoryBadge categoria={g.categoria} /></td>
                                        <td className="px-8 py-5">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${CONFIG_TIPOS[g.tipo]?.badge || 'bg-slate-100 text-slate-500'}`}>
                                                {g.tipo}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-slate-800">{formatCurrency(g.valor)}</td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => setEditandoGasto(g)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDeleteGasto(g.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {editandoGasto && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-800">Editar Gasto</h3>
                            <button onClick={() => setEditandoGasto(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleUpdateGasto} className="space-y-6">
                            <div>
                                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Estabelecimento</label>
                                <input
                                    type="text" className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
                                    value={editandoGasto.estabelecimento} onChange={e => setEditandoGasto({ ...editandoGasto, estabelecimento: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Categoria</label>
                                    <select
                                        className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
                                        value={editandoGasto.categoria} onChange={e => setEditandoGasto({ ...editandoGasto, categoria: e.target.value })}
                                    >
                                        {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Tipo</label>
                                    <select
                                        className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
                                        value={editandoGasto.tipo} onChange={e => setEditandoGasto({ ...editandoGasto, tipo: e.target.value })}
                                    >
                                        {TIPOS_GASTO_LISTA.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black uppercase text-slate-400 mb-1 block">Valor (R$)</label>
                                <input
                                    type="number" step="0.01"
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none font-black text-slate-700 focus:ring-2 focus:ring-emerald-500"
                                    value={editandoGasto.valor} onChange={e => setEditandoGasto({ ...editandoGasto, valor: e.target.value })}
                                />
                            </div>
                            <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
                                <Save size={20} /> Salvar Alterações
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TelaPerfil;