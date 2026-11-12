# Plano de iniciação — site-aquecedores-mairipora

**Data:** 2026-11-12  
**Responsável pelo levantamento:** operador do workspace (registro da sessão)  
**Estado:** decisões de escopo registradas; dados comerciais pendentes de validação

## Contexto

- **Projeto e categoria:** `site-aquecedores-mairipora`, em `projetos/sites/`.
- **Objetivo:** substituir o site atual publicado no Blogger por uma landing page estática de página única, mantendo uma cópia navegável do site original como arquivo histórico.
- **Entregáveis:**
  - `static/index.html` com a nova landing page.
  - `static/assets/css/styles.css` e `static/assets/js/main.js` (uma folha e um script).
  - `static/versao-antiga/` com as três páginas capturadas do site original e seus ativos locais.
  - Link rotulado **“Versão antiga”** no rodapé da nova página.
  - Briefing, lista de requisitos, plano de iniciação e índice de referências.
- **Público e interessados:** moradores de Mairiporã e região que precisam de instalação, manutenção ou aquecimento de piscina; responsável pela empresa, que valida contatos, serviços e marcas.
- **Restrições:**
  - Publicação apenas de `static/` (GitHub Pages).
  - Sem back-end, compilação, frameworks ou dependências de npm.
  - Dados de contato, endereço, horário, marcas e condições comerciais não confirmados permanecem como placeholders `[a definir]`.
  - Direitos das imagens e marcas do site antigo pertencem aos titulares; o uso no arquivo deve ser confirmado antes de qualquer republicação fora do caráter histórico.
- **Informações disponíveis e origens:**
  - Site atual: `https://aquecedoresmairipora.blogspot.com/`, capturado em 2026-11-12 em `referencias/fonte-site-atual/` com manifesto e conteúdo extraído.
  - Template de landing page: `projetos/_templates/template-site-landing-page/`, usado como modelo técnico.
  - Fatos comerciais do site antigo (2018, não confirmados): WhatsApp, telefone, e-mail, endereço, serviços e marcas. Foram tratados como referência histórica, não como dados publicáveis.
- **Questões ainda abertas:**
  - Número de WhatsApp, telefone, e-mail, endereço e horário atuais.
  - Serviços efetivamente oferecidos hoje, cobertura por bairro e condições de orçamento.
  - Marcas e equipamentos atendidos e autorização de uso de nomes e imagens.
  - Canal definitivo que receberá os pedidos (WhatsApp, e-mail ou formulário com back-end).

## Referência de gestão consultada

- **Referência inicial:** PMBOK 8ª edição (EN), `REF-0358`, conforme o catálogo técnico.
- **Caminho local:** `REPERTORIO_TECNICO/01_GESTAO_DE_PROJETOS/01_METODOLOGIAS_E_GUIAS/PMI - A Guide to the Project Management Body of Knowledge (EN) - 8a edicao.pdf`.
- **Seção consultada:** Scope Performance Domain, seções 2.2 a 2.2.3; páginas impressas 35–45 (PDF, páginas 104–114).
- **Pertinência:** orientou a separação entre escopo aprovado, entregáveis, critérios de aceitação e exclusões desta primeira versão.
- **Limites da consulta:** leitura por extração de texto; não houve cópia da obra. A consulta não equivale à seleção ou aprovação da obra para a base documental.
- **Inclusão na base documental:** pendente de seleção e aprovação próprias, se necessária.

## Fontes para a base

- Nenhuma fonte da biblioteca foi selecionada para cópia neste projeto.
- O site atual foi capturado como insumo de trabalho em `referencias/fonte-site-atual/`; a captura é uma cópia de referência do próprio objeto do projeto, não uma fonte da biblioteca.
- O template foi lido e derivado localmente, conforme `AGENTS.md` do template; não há cópia de fonte externa.
- Estado detalhado, decisão por fonte e verificação das cópias: [`../../referencias/indice-referencias.md`](../../referencias/indice-referencias.md).

## Avaliação de insumos

| Insumo candidato | Recomendação | Justificativa neste projeto | Informação necessária ou fonte | Decisão do operador |
|---|---|---|---|---|
| Briefing do negócio | Incluir | Consolida oferta, público, conversão e lacunas antes de publicar | Relato do operador e site atual | Incluído em `docs/briefing-negocio.md` |
| Lista de requisitos | Incluir | Torna explícito o que entra na primeira versão e como será aceito | Escopo decidido na iniciação | Incluída em `docs/lista-requisitos.md` |
| Mapa de empatia | Dispensar | O público e as objeções já estão sintetizados no briefing; não há pesquisa primária | — | Dispensado nesta versão |
| Persona | Dispensar | O atendimento é local e segmentado por tipo de imóvel, não por persona fictícia | — | Dispensado nesta versão |
| Mapa de processos | Dispensar | O fluxo é uma página com um formulário e um canal de envio; o processo operacional ainda não foi validado | — | Reavaliar após definir o canal de atendimento |
| Arquitetura de conversão | Incluir | Define a ordem das seções e o caminho até o pedido | Estrutura da landing page | Implementada em `static/index.html` |

## Proposta e decisão

- **Resumo da proposta:** landing page de página única com apresentação institucional, serviços, processo, diferenciais, público, FAQ e formulário que gera um resumo local; rodapé com link para o arquivo do site original.
- **Data e meio da decisão:** 2026-11-12, decisão registrada na conversa de iniciação.
- **Decisão expressa pelo operador:**
  - criar o projeto em `projetos/sites/site-aquecedores-mairipora`;
  - entregar somente a landing page, sem módulos ou protótipos na primeira versão;
  - usar placeholders para dados comerciais até validação;
  - manter cópia do site original e link **“Versão antiga”** dentro da nova página.
- **Ressalvas e pendências:** os dados de contato e as marcas não foram confirmados; a página não envia dados a nenhum servidor enquanto o canal definitivo não for definido.
- **Próximo passo autorizado:** concluir a landing page e o arquivo, executar `verificar-padrao.ps1` e submeter os textos comerciais à validação do responsável pela empresa.
