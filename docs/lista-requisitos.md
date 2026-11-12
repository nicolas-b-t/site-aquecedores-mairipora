# Lista de requisitos — site-aquecedores-mairipora

**Data:** 2026-11-12  
**Versão:** 2.0 (revisão de escopo)  
**Base:** decisões da iniciação em [`iniciacao/plano-iniciacao.md`](iniciacao/plano-iniciacao.md) e briefing em [`briefing-negocio.md`](briefing-negocio.md).

> **Mudança de escopo (v2):** a versão anterior tinha formulário, UTM, aviso LGPD e FAQ. A pedido do operador, a página passou a ser **uma única visualização**, sem módulos de funcionalidade: o contato é direto por WhatsApp, telefone e e-mail. Os dados comerciais foram trazidos do site original.

## 1. Requisitos funcionais

| ID | Requisito | Prioridade | Critério de aceitação | Estado |
|---|---|---|---|---|
| RF-01 | Apresentar a empresa, a proposta de valor e a ação de orçamento na primeira dobra | Essencial | `static/index.html` contém `h1` único, texto de apoio e botões de WhatsApp e telefone | Implementado |
| RF-02 | Listar os serviços em nove itens curtos, com ícones | Essencial | Grade de 9 itens: solar, elétrico, piscina, banheira, capa térmica, resistência, bombas, filtros e sauna | Implementado |
| RF-03 | Exibir as marcas trabalhadas | Desejável | Linha “Marcas” com Termomax, Heliodin, Solarmax, Tempersol, Industek, Komeco, Tigre e Amanco | Implementado |
| RF-04 | Publicar os contatos em destaque no topo da página | Essencial | Barra superior com telefone fixo `(11) 97944-5226` (`tel:`), WhatsApp `(11) 99765-1790` (`wa.me/5511997651790`) e e-mail `aquecedoresmairipora@gmail.com` (`mailto:`); endereço no hero | Implementado |
| RF-05 | Usar imagens do site original | Desejável | Três imagens em `static/assets/img/`, com texto alternativo e legendas | Implementado |
| RF-05b | Exibir logotipo vetorial nítido | Essencial | `assets/img/logo-aquecedores-mairipora.svg` no cabeçalho, sem moldura raster | Implementado |
| RF-06 | Caber em uma única visualização em telas grandes | Essencial | Em 1024×768, 1280×720, 1366×768, 1440×900 e 1920×1080 não há rolagem; verificado em navegador headless | Implementado |
| RF-07 | Manter o arquivo do site original acessível | Essencial | Link **“Versão antiga”** no rodapé, apontando para `versao-antiga/index.html` | Implementado |
| RF-08 | Identificar o arquivo como histórico | Essencial | As três páginas do arquivo mantêm faixa de aviso, retorno à nova página e `noindex, nofollow` | Implementado |
| RF-09 | Atualizar o ano do rodapé | Desejável | Elemento `[data-current-year]` recebe o ano corrente | Implementado |

## 2. Requisitos não funcionais

| ID | Requisito | Critério de aceitação | Estado |
|---|---|---|---|
| RNF-01 | Publicação estática, sem back-end ou compilação | GitHub Pages publica somente `static/`; sem npm, bundler ou framework | Implementado |
| RNF-02 | Uma única folha de estilo e um único script | `static/assets/css/styles.css` e `static/assets/js/main.js` | Implementado |
| RNF-03 | Sem estilos ou SVGs inline na página principal | `verificar-padrao.ps1` não encontra `style=` nem `<svg>` em `static/*.html` | Implementado |
| RNF-04 | Acessibilidade WCAG 2.2 AA | Foco visível, rótulos, contraste, alvos de 44 px na navegação e texto alternativo nas imagens | Verificado no padrão; revisão manual pendente |
| RNF-05 | Estética neobrutalista | `data-estilo="neobrutalista"`, bordas de 2 px, sombras sólidas e tipografia pesada | Implementado |
| RNF-06 | Privacidade | A página não possui formulário, cookies, analytics ou armazenamento local | Implementado |
| RNF-07 | Conteúdo verificável | Contatos e serviços vêm do site original; nenhum preço, prazo ou garantia é publicado | Implementado |
| RNF-08 | Padronização técnica | `verificar-padrao.ps1` aprova os dez invariantes | Aprovado em 2026-11-12 |
| RNF-09 | Desempenho | 4 imagens somando ~166 KB; sem fontes ou bibliotecas externas | Implementado |
| RNF-10 | Arquivo autocontido | Páginas do arquivo não dependem de scripts ou imagens do Blogger | Implementado |
| RNF-11 | Publicação automatizada | `push` em `main` publica apenas `static/` via GitHub Pages | Publicado em 2026-11-12 |

## 3. Removido nesta versão

- Formulário de orçamento, validação de campos, resumo local e captura de UTMs.
- Banner e modal de privacidade (não há coleta de dados).
- FAQ em `<details>`, barra flutuante e botão de seleção de serviço.
- Seções “Como funciona”, “Diferenciais” e “Público” em cartões separados.

O contrato [`../lead-schema.json`](../lead-schema.json) permanece apenas como referência para um eventual formulário futuro; não é usado pela página.

## 4. Pendências

| Item | Situação | Ação necessária |
|---|---|---|
| Confirmação dos contatos e do endereço | Trazidos do site de 2018 | Confirmar com a empresa |
| Horário de atendimento | Não consta no site original | Informar, se for publicar |
| Direitos das imagens e marcas | Uso histórico das imagens do cliente | Confirmar manutenção pública |
| Política de privacidade | Antiga, cita legislação de Portugal | Substituir, se necessário |

## 5. Rastreabilidade

- Decisões: [`iniciacao/plano-iniciacao.md`](iniciacao/plano-iniciacao.md).
- Contexto comercial: [`briefing-negocio.md`](briefing-negocio.md).
- Fontes e cópias: [`../referencias/indice-referencias.md`](../referencias/indice-referencias.md).
