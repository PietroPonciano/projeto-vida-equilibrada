import React, { useState } from 'react';

// utils / constantes
import { CATEGORIAS, TIPOS_GASTO_LISTA } from '../constants/finance';

// services
import api from '../services/api';

// icons (lucide)
import {
    PlusCircle,
    Store,
    DollarSign,
    Calendar,
    Tags,
    Check,
    AlertCircle,
    Save,
    UploadCloud,
    FileType2
} from 'lucide-react';

function FormularioGasto({ onSuccess }) {
    const [categoria, setCategoria] = useState('');
    const [valor, setValor] = useState('');
    const [estabelecimento, setEstabelecimento] = useState('');
    const [dataGasto, setDataGasto] = useState(new Date().toISOString().split('T')[0]);
    const [tipoPredominante, setTipoPredominante] = useState('VARIAVEL');
    const [msg, setMsg] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');

    const handleValorChange = (e) => {
        let inputValue = e.target.value.replace(/\D/g, "");
        if (inputValue === "") { setValor(""); return; }
        const numericValue = Number(inputValue) / 100;
        const formattedValue = new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue);
        setValor(formattedValue);
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        const valorLimpo = valor.replace(/\./g, '').replace(',', '.');
        const valorParaBanco = parseFloat(valorLimpo);

        if (!categoria || !tipoPredominante || isNaN(valorParaBanco) || valorParaBanco <= 0 || !estabelecimento || !dataGasto) {
            setMsg({ type: 'error', text: 'Preencha todos os campos corretamente.' });
            return;
        }

        const payload = {
            categoria,
            tipo: tipoPredominante,
            valor: valorParaBanco,
            estabelecimento,
            dataGasto
        };

        try {
            await api.post('/gastos', payload);

            setMsg({ type: 'success', text: 'Gasto registrado com sucesso!' });
            setCategoria('');
            setValor('');
            setEstabelecimento('');
            onSuccess && onSuccess();

        } catch (err) {
            setMsg({ type: 'error', text: 'Erro ao salvar gasto.' });
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await api.post('/extrato/importar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = res.data;

            setUploadStatus('success');
            setUploadMessage(`${data.count || 0} gastos importados!`);
            onSuccess && onSuccess();

        } catch (err) {
            setUploadStatus('error');

            setUploadMessage(
                err.response?.data?.error || 'Erro no processamento'
            );

        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-50 rounded-2xl text-emerald-600"><PlusCircle size={24} /></div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Novo Gasto</h2>
                        <p className="text-slate-500 text-sm font-medium">Registre uma despesa manualmente</p>
                    </div>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-1">Estabelecimento</label>
                            <div className="relative">
                                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text" placeholder="Ex: Supermercado"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                                    value={estabelecimento} onChange={e => setEstabelecimento(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-1">Valor</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text" placeholder="0,00"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-black text-slate-700"
                                    value={valor} onChange={handleValorChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-1">Data</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="date"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                                    value={dataGasto} onChange={e => setDataGasto(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-400 ml-1">Categoria</label>
                            <div className="relative">
                                <Tags className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <select
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 appearance-none"
                                    value={categoria} onChange={e => setCategoria(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black uppercase text-slate-400 ml-1">Tipo de Gasto</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {TIPOS_GASTO_LISTA.map((t) => {
                                const Icon = t.icon;
                                const isActive = tipoPredominante === t.id;
                                return (
                                    <button
                                        key={t.id} type="button"
                                        onClick={() => setTipoPredominante(t.id)}
                                        className={`flex items-start gap-3 p-4 rounded-2xl border-2 transition-all text-left group
                          ${isActive ? t.active : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`p-2 rounded-xl transition-colors ${isActive ? t.iconActive : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-sm font-bold ${isActive ? t.text : 'text-slate-600'}`}>{t.label}</span>
                                                {isActive && <Check size={14} className={t.check} />}
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{t.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {msg && (
                        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in-95 duration-300 ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {msg.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                            <p className="text-sm font-bold">{msg.text}</p>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]">
                        <Save size={20} /> Salvar Gasto
                    </button>
                </form>
            </div>

            <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><UploadCloud size={24} /></div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800">Importar CSV</h2>
                            <p className="text-slate-500 text-sm font-medium">Sincronize faturas do banco</p>
                        </div>
                    </div>

                    <div className="relative h-[calc(100%-100px)] min-h-[300px]">
                        <input
                            type="file" accept=".csv,.pdf" id="csvUpload" className="hidden"
                            onChange={handleFileUpload} disabled={isUploading}
                        />
                        <label
                            htmlFor="csvUpload"
                            className={`flex flex-col items-center justify-center h-full border-2 border-dashed rounded-[2rem] transition-all duration-300 cursor-pointer
                    ${isUploading ? 'bg-slate-100 border-slate-300 cursor-wait' :
                                    uploadStatus === 'success' ? 'bg-emerald-50/50 border-emerald-200' :
                                        uploadStatus === 'error' ? 'bg-red-50/50 border-red-200' :
                                            'bg-slate-50/50 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/30'}`}
                        >
                            <div className={`w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 transition-transform ${isUploading ? 'animate-pulse scale-90' : 'group-hover:scale-110'}`}>
                                {isUploading ? (
                                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                ) : uploadStatus === 'success' ? (
                                    <div className="text-emerald-500 font-bold text-2xl">✓</div>
                                ) : (
                                    <FileType2 className={`w-8 h-8 ${uploadStatus === 'error' ? 'text-red-500' : 'text-blue-500'}`} />
                                )}
                            </div>
                            <p className={`text-sm font-bold text-center px-4 transition-colors ${uploadStatus === 'success' ? 'text-emerald-700' :
                                uploadStatus === 'error' ? 'text-red-700' : 'text-slate-700'
                                }`}>
                                {isUploading ? 'Processando...' : uploadStatus ? uploadMessage : 'Selecione o arquivo CSV'}
                            </p>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormularioGasto;