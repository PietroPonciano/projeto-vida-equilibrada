import React from 'react';

export default function TermosPoliticas() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* HEADER */}
        <header className="bg-white rounded-2xl shadow-sm border p-6 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-emerald-600 text-white font-bold rounded-xl">
            VE
          </div>

          <div>
            <h1 className="text-2xl font-black text-slate-800">
              Vida Equilibrada — Termos & Políticas
            </h1>
            <p className="text-sm text-slate-500">
              Última atualização: <strong>09/08/2025</strong>
            </p>
          </div>
        </header>

        {/* SOBRE */}
        <section className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">
            Sobre este documento
          </h2>

          <p className="text-slate-600 leading-relaxed">
            Este documento reúne os <strong>Termos de Uso</strong>, <strong>Política de Privacidade</strong>, <strong>Aviso Legal</strong> e a <strong>Política de Cookies</strong> do Vida Equilibrada.
          </p>

          <nav className="flex flex-wrap gap-3 pt-2">
            {[
              { id: 'termos', label: 'Termos de Uso' },
              { id: 'privacidade', label: 'Privacidade' },
              { id: 'aviso', label: 'Aviso Legal' },
              { id: 'cookies', label: 'Cookies' },
              { id: 'contato', label: 'Contato' }
            ].map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="text-sm font-semibold text-emerald-600 hover:underline"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </section>

        {/* MAIN */}
        <main className="space-y-8">

          {/* CARD BASE */}
          {[
            {
              id: 'termos',
              title: 'Termos de Uso',
              content: (
                <>
                  <p>Bem-vindo(a) ao Vida Equilibrada...</p>

                  <h3 className="font-bold mt-4">1. Objetivo</h3>
                  <p>Ferramentas de controle financeiro pessoal.</p>

                  <h3 className="font-bold mt-4">2. Cadastro</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Manter dados seguros</li>
                    <li>Não compartilhar credenciais</li>
                    <li>Uso apenas pessoal</li>
                  </ul>
                </>
              )
            },
            {
              id: 'privacidade',
              title: 'Política de Privacidade',
              content: (
                <>
                  <p>Em conformidade com a LGPD.</p>

                  <h3 className="font-bold mt-4">Dados coletados</h3>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Nome, e-mail, senha</li>
                    <li>Dados financeiros</li>
                  </ul>
                </>
              )
            },
            {
              id: 'aviso',
              title: 'Aviso Legal',
              content: (
                <p>
                  Conteúdo informativo, não substitui consultoria profissional.
                </p>
              )
            }
          ].map(section => (
            <article
              key={section.id}
              id={section.id}
              className="bg-white rounded-2xl shadow-sm border p-6 space-y-3"
            >
              <h2 className="text-xl font-black text-slate-800">
                {section.title}
              </h2>
              {section.content}
            </article>
          ))}

          {/* COOKIES */}
          <article id="cookies" className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <h2 className="text-xl font-black text-slate-800">
              Política de Cookies
            </h2>

            <p>Utilizamos cookies para melhorar a experiência.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-3 text-left">Tipo</th>
                    <th className="p-3 text-left">Finalidade</th>
                    <th className="p-3 text-left">Exemplo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="p-3">Essenciais</td>
                    <td className="p-3">Autenticação</td>
                    <td className="p-3">sessionid</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Preferências</td>
                    <td className="p-3">Configurações</td>
                    <td className="p-3">theme</td>
                  </tr>
                  <tr className="border-t">
                    <td className="p-3">Analíticos</td>
                    <td className="p-3">Métricas</td>
                    <td className="p-3">ga</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>

          {/* CONTATO */}
          <article id="contato" className="bg-white rounded-2xl shadow-sm border p-6 space-y-3">
            <h2 className="text-xl font-black text-slate-800">
              Contato
            </h2>

            <p>Dúvidas ou solicitações:</p>

            <a
              href="mailto:equilibradavida82@gmail.com"
              className="text-emerald-600 font-semibold hover:underline"
            >
              equilibradavida82@gmail.com
            </a>
          </article>

        </main>

        {/* FOOTER */}
        <footer className="bg-white rounded-2xl shadow-sm border p-6 flex justify-between items-center">
          <span className="text-sm text-slate-500">
            © Vida Equilibrada
          </span>

          <a
            href="/"
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition"
          >
            Voltar ao Painel
          </a>
        </footer>

      </div>
    </div>
  );
}