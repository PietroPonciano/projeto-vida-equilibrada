import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    salario: 'R$ 0,00',
    password1: '',
    password2: '',
    aceitou_termos: false,
    aceito_cookies: false,
  });

  // Estado para os critérios da senha
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    upper: false,
    special: false,
  });

  // Efeito para validar a senha em tempo real
  useEffect(() => {
    const pwd = form.password1;
    setPasswordCriteria({
      length: pwd.length >= 8,
      number: /[0-9]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    });
  }, [form.password1]);

  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;

  // Lógica de Cores da Barra
  const getStrengthColor = () => {
    if (strengthScore <= 1) return 'bg-red-500 w-1/4';
    if (strengthScore <= 3) return 'bg-yellow-500 w-2/4';
    return 'bg-emerald-500 w-full';
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/\D/g, '');
    const floatValue = (parseFloat(numericValue) / 100).toFixed(2);
    return 'R$ ' + floatValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseCurrency = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Nova validação de segurança
    if (strengthScore < 4) {
      alert('Sua senha precisa ser mais forte para garantir sua segurança.');
      return;
    }

    if (!form.username.trim() || !form.email.trim() || !form.password1 || !form.password2) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (form.password1 !== form.password2) {
      alert('As senhas não coincidem.');
      return;
    }

    if (!form.aceitou_termos) {
      alert('Você deve aceitar os Termos de Uso.');
      return;
    }

    const salarioNumerico = parseCurrency(form.salario);
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password1,
      salario: salarioNumerico,
      aceitou_termos: form.aceitou_termos,
      aceito_cookies: form.aceito_cookies,
    };

    try {
      await axios.post('http://localhost:8080/auth/register', payload);
      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (err) {
      alert('Erro ao criar conta. Verifique os dados.');
    }
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none placeholder:text-slate-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-6 font-sans">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Criar Conta</h2>
          <p className="text-slate-500 mt-2">Proteja seus dados com uma senha forte</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Usuário</label>
              <input className={inputClass} placeholder="Seu nome de usuário" value={form.username} onChange={(e) => handleChange('username', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">E-mail</label>
              <input className={inputClass} type="email" placeholder="seu@email.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Salário <p className="text-sm text-slate-400 font-medium mt-1">
                (Opcional)
              </p></label>
              <input className={inputClass} value={form.salario} onChange={(e) => handleChange('salario', formatCurrency(e.target.value))} />
            </div>

            {/* Campo de Senha com Verificador */}
            <div className="md:col-span-2 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Senha</label>
                  <input className={inputClass} type="password" placeholder="••••••••" value={form.password1} onChange={(e) => handleChange('password1', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Confirmar Senha</label>
                  <input className={inputClass} type="password" placeholder="••••••••" value={form.password2} onChange={(e) => handleChange('password2', e.target.value)} />
                </div>
              </div>

              {/* Barra de Força da Senha */}
              {form.password1 && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Força da Senha</span>
                    <span className="text-xs font-bold text-emerald-600">{strengthScore === 4 ? 'Excelente' : 'Melhore sua senha'}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${getStrengthColor()}`}></div>
                  </div>

                  {/* Checklist de requisitos */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <RequirementItem met={passwordCriteria.length} text="8+ caracteres" />
                    <RequirementItem met={passwordCriteria.upper} text="Letra maiúscula" />
                    <RequirementItem met={passwordCriteria.number} text="Um número" />
                    <RequirementItem met={passwordCriteria.special} text="Símbolo (!@#)" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Checkbox de Termos */}
          <div className="flex items-start gap-3 py-2">
            <input
              id="aceito-termos"
              type="checkbox"
              checked={form.aceitou_termos}
              onChange={(e) => handleChange('aceitou_termos', e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="aceito-termos" className="text-sm text-slate-600 cursor-pointer">
              Eu aceito os <span className="font-semibold text-emerald-700">Termos de Uso</span> e <Link to="/politics" className="text-emerald-700 underline">Privacidade</Link>
            </label>
          </div>

          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]">
            Finalizar Cadastro
          </button>
        </form>
      </div>
    </div>
  );
}

// Sub-componente para os itens da lista de requisitos
function RequirementItem({ met, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
      <span className={`text-[11px] font-medium ${met ? 'text-emerald-700' : 'text-slate-400'}`}>{text}</span>
    </div>
  );
}