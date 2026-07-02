import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronRight, 
  TrendingUp, 
  PieChart, 
  FileText, 
  ArrowRight,
  Quote
} from 'lucide-react';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqData = [
    { q: "O Vida Equilibrada é gratuito?", a: "Sim! Oferecemos uma versão completa para controle pessoal sem custos." },
    { q: "Meus dados estão seguros?", a: "Utilizamos criptografia de ponta a ponta para garantir que apenas você tenha acesso às suas informações financeiras." },
    { q: "Posso exportar meus relatórios?", a: "Com certeza. Você pode gerar PDFs detalhados dos seus gastos mensais a qualquer momento." },
    { q: "Preciso conectar minha conta bancária?", a: "Não. O foco é o controle manual consciente para que você entenda cada centavo que entra e sai." },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-32 md:pb-40">
        {/* Background Decorativo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] opacity-60"></div>
          <div className="absolute bottom-0 right-[-5%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[100px] opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-8">
            
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Sua jornada para a <span className="text-emerald-600">liberdade</span> financeira.
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Organize seus gastos, planeje o futuro e alcance a tranquilidade que você merece com uma interface simples e poderosa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register" className="group px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                Começar agora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#sobre" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center">
                Conhecer ferramentas
              </a>
            </div>
          </div>

          {/* Mockup Premium */}
          <div className="relative flex justify-center lg:justify-end animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <div className="relative w-[320px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-emerald-900/20 border-[8px] border-slate-800">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
              <div className="w-full h-full bg-emerald-50 rounded-[2.2rem] overflow-hidden flex flex-col">
                <div className="p-6 space-y-4 pt-12">
                  <div className="h-32 bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase">Saldo Total</span>
                    <span className="text-2xl font-bold text-emerald-600 leading-none">R$ 12.450,00</span>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[70%] h-full bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-14 bg-white/60 rounded-xl flex items-center px-4 gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-2 w-20 bg-slate-200 rounded"></div>
                          <div className="h-2 w-12 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Elemento flutuante */}
            
          </div>
        </div>
      </section>

      {/* Features com Grid Moderno */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Tudo o que você precisa em um só lugar</h2>
            <p className="text-slate-600">Ferramentas pensadas para facilitar sua rotina, sem planilhas complexas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Controle de Despesas"
              desc="Categorize seus gastos em segundos e saiba exatamente para onde seu dinheiro está indo."
            />
            <FeatureCard 
              icon={<PieChart className="w-8 h-8" />}
              title="Análise Visual"
              desc="Gráficos interativos que mostram sua evolução financeira ao longo dos meses."
            />
            <FeatureCard 
              icon={<FileText className="w-8 h-8" />}
              title="Relatórios Exportáveis"
              desc="Gere relatórios profissionais em PDF para organizar sua declaração ou planejamento anual."
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section - Estilo Card */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-emerald-600 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
             <Quote className="absolute top-10 right-10 w-40 h-40 text-white/10 rotate-12" />
             <div className="relative z-10 max-w-3xl">
                <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed mb-8">
                  "Depois que comecei a usar o Vida Equilibrada, finalmente entendi onde eu estava errando. Em 3 meses, consegui montar minha primeira reserva de emergência."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">P</div>
                  <div>
                    <p className="text-white font-bold">Pedro Henrique</p>
                    <p className="text-emerald-100 text-sm">Usuário desde 2024</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Moderno */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {faqData.map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-slate-700">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-600 animate-in fade-in slide-in-from-top-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Final */}
      <footer className="bg-slate-900 text-slate-400 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-white text-2xl font-bold">
              <LandmarkIcon /> VidaEquilibrada
            </div>
            <p className="max-w-sm">
              Simplificando a gestão financeira para que você foque no que realmente importa: viver bem.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors">Criar Conta</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-white font-bold">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/politics" className="hover:text-emerald-400 transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politics" className="hover:text-emerald-400 transition-colors">Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 text-center text-xs tracking-widest uppercase">
          © 2026 VidaEquilibrada — Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

// Sub-componentes para limpeza de código
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group">
      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function LandmarkIcon() {
  return (
    <div className="bg-emerald-600 p-1.5 rounded-lg">
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 21h18M3 10h18M5 10v11M19 10v11M12 10v11M7 10V4l5-2 5 2v6" /></svg>
    </div>
  );
}