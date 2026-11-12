# Registro de alterações — site-aquecedores-mairipora

Histórico das entregas do projeto. Datas no fuso local do operador.

## 2026-11-12 — v3: logo vetorial e contatos em destaque

- **Logotipo vetorial:** criado `static/assets/img/logo-aquecedores-mairipora.svg` (sol com ondas, “AQUEÇEDORES” em vermelho e “MAIRIPORÃ” em azul). O JPG de 300×156 px foi removido do projeto; a linha “Venda · Instalação · Manutenção” passou a ser texto HTML. O original permanece em `static/versao-antiga/`.
- **Favicon:** trocado para `static/assets/img/marca-sol.svg`.
- **Contatos em destaque:** a faixa de contato do rodapé foi substituída por uma barra superior escura com telefone fixo (maior peso e sublinhado de acento), WhatsApp, e-mail e região. O endereço foi para o hero, abaixo dos botões, e o rodapé ficou com ©, crédito das imagens e o link “Versão antiga”.
- **Novo telefone fixo:** (11) 97944-5226, informado pelo responsável, aplicado em `tel:`, botão do hero, JSON-LD e documentação. O WhatsApp (11) 99765-1790 foi mantido.
- **Ajustes visuais:** escala do `h1` corrigida para não quebrar em três linhas a 1024 px; tema escuro com barra superior escura e placa branca atrás do logo; barra compacta no mobile.
- **Deploy:** commit `595a6f1`.

## 2026-11-12 — v2: redesenho em tela única e estética neobrutalista

- **Escopo reduzido:** removidos formulário de orçamento, validação, resumo local, captura de UTMs, banner e modal LGPD, FAQ, cartões de “Como funciona”, “Diferenciais” e “Público”, barra flutuante e `SITE_CONFIG`.
- **Dados do site original publicados:** WhatsApp, telefone, e-mail, endereço, nove serviços e oito marcas.
- **Imagens do site antigo:** três fotos otimizadas em `static/assets/img/` (aquecimento de piscina, reservatório Termomax e esquema de instalação), totalizando ~150 KB.
- **Estética:** `data-estilo="neobrutalista"` com `data-brand="industrial-obras"`, bordas de 2 px e sombras sólidas.
- **Tela única:** composição em `100svh`, sem rolagem em 1024×768, 1280×720, 1366×768, 1440×900 e 1920×1080.
- **Deploy:** commit `4af8fd8`.

## 2026-11-12 — v1: iniciação, arquivo do site e primeira publicação

- **Captura do site original:** três páginas, 14 imagens e o CSS público do Blogger em `referencias/fonte-site-atual/`, com manifesto e conteúdo extraído.
- **Estrutura do projeto:** `static/`, `docs/`, `referencias/`, `lead-schema.json`, `verificar-padrao.ps1` e workflow de GitHub Pages.
- **Landing page inicial:** hero com formulário, serviços, processo, diferenciais, público, FAQ e aviso de privacidade.
- **Arquivo navegável:** `static/versao-antiga/` com as três páginas reescritas para ativos locais, faixa de aviso, retorno à nova página e `noindex, nofollow`.
- **Link “Versão antiga”:** no rodapé da nova página.
- **Publicação:** repositório público `nicolas-b-t/site-aquecedores-mairipora` e GitHub Pages habilitado em modo GitHub Actions.
- **Deploy:** commit `c6a7354`.

## Estado atual

- **Site:** <https://nicolas-b-t.github.io/site-aquecedores-mairipora/>
- **Versão antiga:** <https://nicolas-b-t.github.io/site-aquecedores-mairipora/versao-antiga/index.html>
- **Repositório:** <https://github.com/nicolas-b-t/site-aquecedores-mairipora>
- **Verificação:** `verificar-padrao.ps1` aprova os 10 invariantes; CSS em cerca de 61 KB de 64 KB.

## Pendências herdadas

| Item | Situação |
|---|---|
| Telefone (11) 97944-5226 | Publicado como informado; o formato é de celular, embora tenha sido descrito como fixo — confirmar |
| WhatsApp, e-mail e endereço | Dados de 2018; confirmar atualidade |
| Horário de atendimento | Não consta no site original |
| Autorização das marcas e imagens | Confirmar com o responsável |
| Política de privacidade antiga | Cita legislação de Portugal; não serve como política vigente |
