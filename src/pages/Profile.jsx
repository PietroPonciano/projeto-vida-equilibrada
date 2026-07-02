import React, { useEffect, useState } from 'react';

import api from '../services/api';

import Header from '../components/perfil/ProfileHeader';
import Sidebar from '../components/perfil/Sidebar';
import TabGeral from '../components/perfil/TabGeral';
import TabFinanceiro from '../components/perfil/TabFinanceiro';
import TabSeguranca from '../components/perfil/TabSeguranca';
import TabIdioma from '../components/perfil/TabIdioma';
import ModalDesativacao from '../components/perfil/ModalDesativacao';

import { User, Wallet, Lock, Globe, Check, ShieldAlert, Trash2, RefreshCw } from 'lucide-react';

export default function PerfilWeb() {
  const [perfil, setPerfil] = useState(null);
  const [salario, setSalario] = useState('R$ 0,00');
  const [senhaAntiga, setSenhaAntiga] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [idioma, setIdioma] = useState('pt');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [senhaConfirmacao, setSenhaConfirmacao] = useState('');
  const [activeTab, setActiveTab] = useState('geral');

  useEffect(() => {
    loadPerfil();
  }, []);

  useEffect(() => {
    if (perfil?.perfil?.salario != null) {
      const salarioValor = Number(perfil.perfil.salario);

      if (!isNaN(salarioValor)) {
        const salarioFormatado = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(salarioValor);

        setSalario(salarioFormatado);
      }
    }
  }, [perfil?.perfil?.salario]);

  const loadPerfil = async () => {
    try {
      setLoading(true);
      const response = await api.get('/perfil');
      setPerfil(response.data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarSalario = async () => {
    try {
      const salarioNumerico = Number(salario.replace(/\D/g, '')) / 100;

      if (isNaN(salarioNumerico) || salarioNumerico <= 0) {
        throw new Error('Salário inválido');
      }

      await api.put('/perfil/atualizar', {
        salario: salarioNumerico
      });

      alert('Salário atualizado com sucesso!');

      setPerfil((prev) => ({
        ...prev,
        perfil: {
          ...prev.perfil,
          salario: salarioNumerico
        },
      }));
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar salário');
    }
  };

  const confirmarDesativacao = async () => {
    if (!senhaConfirmacao) return alert("Digite sua senha");

    try {
      await api.put('/perfil/desativar', {
        password: senhaConfirmacao
      });

      await api.post('/auth/token/revoke');
      window.location.href = '/login';

    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Senha incorreta";

      alert(message);

    } finally {
      setModalOpen(false);
      setSenhaConfirmacao('');
    }
  };

  const handleTrocarSenha = async () => {
    if (!senhaAntiga || !novaSenha) {
      return alert('Preencha os campos');
    }

    try {
      await api.post('/auth/change-password', {
        old_password: senhaAntiga,
        new_password: novaSenha
      });

      alert('Senha alterada!');
      handleLogout();

    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Erro ao alterar senha';

      alert(message);
    }
  };

  const handleLogout = async () => {
    await api.post('/auth/token/revoke');
    window.location.href = '/login';
  };

  const handleIdioma = (lang) => {
    setIdioma(lang);
  };

  const getSaudacao = () => {
    const hora = new Date().getHours();

    if (hora >= 5 && hora < 12) return 'Bom dia';
    if (hora >= 12 && hora < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw className="animate-spin text-emerald-600 mb-4" size={40} />
        <p>Carregando...</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <Header perfil={perfil} getSaudacao={getSaudacao} />

        <div className="flex flex-col md:flex-row gap-8">

          {/* SIDEBAR */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* CONTENT */}
          <main className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">

            {activeTab === 'geral' && (
              <TabGeral perfil={perfil} />
            )}

            {activeTab === 'financeiro' && (
              <TabFinanceiro
                salario={salario}
                setSalario={setSalario}
                handleSalvarSalario={handleSalvarSalario}
              />
            )}

            {activeTab === 'seguranca' && (
              <TabSeguranca
                senhaAntiga={senhaAntiga}
                setSenhaAntiga={setSenhaAntiga}
                novaSenha={novaSenha}
                setNovaSenha={setNovaSenha}
                handleTrocarSenha={handleTrocarSenha}
                setModalOpen={setModalOpen}
              />
            )}

            {activeTab === 'idioma' && (
              <TabIdioma
                idioma={idioma}
                handleIdioma={handleIdioma}
              />
            )}

          </main>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <ModalDesativacao
            senhaConfirmacao={senhaConfirmacao}
            setSenhaConfirmacao={setSenhaConfirmacao}
            confirmarDesativacao={confirmarDesativacao}
            setModalOpen={setModalOpen}
          />
        )}

      </div>
    </div>
  );
}