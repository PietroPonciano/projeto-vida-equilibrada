// constants/finance.js

import { RefreshCw, Activity, Sparkles, CalendarClock } from 'lucide-react';

export const CATEGORIAS = [
  'Moradia',
  'Alimentação',
  'Transporte',
  'Saúde',
  'Educação',
  'Lazer',
  'Investimento',
  'Outros'
];

export const CORES_CATEGORIAS = {
  Moradia: '#3B82F6',
  Alimentação: '#F59E0B',
  Transporte: '#8B5CF6',
  Saúde: '#EF4444',
  Educação: '#06B6D4',
  Lazer: '#EC4899',
  Investimento: '#10B981',
  Outros: '#94A3B8',
};

export const CONFIG_TIPOS = {
  RECORRENTE: {
    id: 'RECORRENTE',
    label: 'Recorrente',
    desc: 'Contas fixas, aluguel, assinaturas',
    icon: RefreshCw,
    color: 'blue',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
    active: 'border-blue-500 bg-blue-50/50 ring-blue-500/10',
    iconActive: 'bg-blue-500 text-white',
    check: 'text-blue-600',
  },
  VARIAVEL: {
    id: 'VARIAVEL',
    label: 'Variável',
    desc: 'Alimentação, transporte, dia a dia',
    icon: Activity,
    color: 'emerald',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
    badge: 'bg-emerald-100 text-emerald-700',
    active: 'border-emerald-500 bg-emerald-50/50 ring-emerald-500/10',
    iconActive: 'bg-emerald-500 text-white',
    check: 'text-emerald-600',
  },
  OCASIONAL: {
    id: 'OCASIONAL',
    label: 'Ocasional',
    desc: 'Viagens, presentes, compras extras',
    icon: Sparkles,
    color: 'amber',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
    active: 'border-amber-500 bg-amber-50/50 ring-amber-500/10',
    iconActive: 'bg-amber-500 text-white',
    check: 'text-amber-600',
  },
  SAZONAL: {
    id: 'SAZONAL',
    label: 'Sazonal',
    desc: 'IPTU, IPVA, matrículas anuais',
    icon: CalendarClock,
    color: 'purple',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100',
    badge: 'bg-purple-100 text-purple-700',
    active: 'border-purple-500 bg-purple-50/50 ring-purple-500/10',
    iconActive: 'bg-purple-500 text-white',
    check: 'text-purple-600',
  },
};

export const TIPOS_GASTO_LISTA = Object.values(CONFIG_TIPOS);