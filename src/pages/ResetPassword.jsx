import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importado para consistência

export default function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    recovery_code: "",
    new_password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.username || !form.recovery_code || !form.new_password) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/reset-password/", form);
      setSuccess(res.data.message || "Senha redefinida com sucesso!");
      setForm({ username: "", recovery_code: "", new_password: "" });
      
      // Opcional: redirecionar para o login após alguns segundos
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao redefinir senha");
    }
  };

  // Classe padrão para os inputs para evitar repetição
  const inputStyle = "w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-base placeholder-slate-400 transition-all duration-200 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-8 tracking-tight">
          Resetar Senha
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <input
              name="username"
              placeholder="Usuário"
              value={form.username}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div>
            <input
              name="recovery_code"
              placeholder="Código de Recuperação"
              value={form.recovery_code}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          <div>
            <input
              name="new_password"
              type="password"
              placeholder="Nova senha"
              value={form.new_password}
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Mensagem de Sucesso */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm px-4 py-3 rounded-xl text-center font-medium">
              {success}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Redefinir
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)} // Volta para a página anterior
              className="w-full bg-transparent text-emerald-600 border-2 border-emerald-600 font-semibold py-3.5 rounded-xl transition-all duration-200 hover:bg-emerald-50 active:scale-[0.98]"
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}