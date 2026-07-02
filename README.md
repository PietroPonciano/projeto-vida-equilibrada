# Vida Equilibrada - Web Frontend

O Vida Equilibrada é uma aplicação web voltada para a gestão e o controle financeiro pessoal, projetada para fornecer uma experiência intuitiva no acompanhamento de receitas, despesas e metas de orçamento. Esta interface se conecta a um ecossistema de serviços de processamento de dados e apresenta painéis visuais ricos para a tomada de decisões.

## Recursos do Sistema

* Autenticação e Segurança: Telas completas e seguras para o fluxo de cadastro de novos usuários, acesso à plataforma e redefinição de senhas de acesso.
* Painel de Controle Avançado: Módulo de dashboard estruturado contendo cartões com resumos rápidos, tabelas interativas de transações e relatórios de métricas.
* Análises Gráficas: Integração com componentes visuais para a geração de gráficos comparativos e análises detalhadas da evolução de consumo diário ou mensal.
* Central do Perfil: Seção configurável dividida em abas específicas para a atualização de dados gerais, informações sobre o planejamento financeiro, configurações de segurança, preferências de idioma e desativação segura da conta.
* Gerenciamento de Transações: Formulários otimizados para o lançamento, classificação por categorias e rotulagem inteligente de novos gastos.

## Organização do Código

A arquitetura do projeto foi estruturada de forma modular, separando as páginas principais dos componentes reutilizáveis da interface:

* src/components/Dashboard: Armazena subcomponentes do painel como cartões de dados, tabelas de listagem, barra lateral de navegação e componentes de gráficos.
* src/components/Perfil: Reúne as abas modulares de gerenciamento de dados financeiros, segurança, idioma e janelas modais de confirmação.
* src/pages: Concentra as páginas estruturais do sistema, englobando a tela inicial, portal de entrada, fluxos de registro, políticas de privacidade e painel logado.
* src/services: Concentra as configurações de integração e chamadas para a API do servidor back-end.
* src/hooks: Contém ganchos customizados para o gerenciamento de estados, consumo assíncrono e carregamento de dados do dashboard.
* src/constants e src/utils: Fornecem dados estáticos padronizados de finanças e funções utilitárias auxiliares de formatação.

## Tecnologias e Dependências

* React como biblioteca base para a construção da interface declarativa em componentes.
* Vite como ferramenta de empacotamento rápida para o ambiente de desenvolvimento e build.
* Biblioteca de gráficos integrada para a renderização de componentes visuais interativos.
* Axios ou Fetch API para a comunicação assíncrona com o servidor.

## Instruções de Instalação e Execução

Para rodar o projeto localmente em sua máquina de desenvolvimento, certifique-se de ter o Node.js instalado e siga os passos abaixo:

1. Instale todas as dependências do projeto listadas no arquivo de configuração do gerenciador de pacotes executando o comando no terminal:
   npm install

2. Configure as variáveis de ambiente necessárias em um arquivo local, apontando para o endereço correto da API de serviços do back-end.

3. Inicie o servidor de desenvolvimento local por meio do comando de inicialização rápida:
   npm run dev

4. Abra o navegador e acesse o endereço fornecido no terminal para visualizar a aplicação em execução local.

## Distribuição e Deploy

A plataforma possui configurações automatizadas para deploy contínuo integrado diretamente com a infraestrutura da Vercel através de regras específicas declaradas no arquivo de roteamento do projeto.