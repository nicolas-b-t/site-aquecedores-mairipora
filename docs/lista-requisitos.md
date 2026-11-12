# Lista de requisitos — site-aquecedores-mairipora

**Data:** 2026-11-12  
**Versão:** 1.0 (primeira entrega)  
**Base:** decisões da iniciação registradas em [`iniciacao/plano-iniciacao.md`](iniciacao/plano-iniciacao.md) e briefing em [`briefing-negocio.md`](briefing-negocio.md).

## 1. Requisitos funcionais

| ID | Requisito | Prioridade | Critério de aceitação | Estado |
|---|---|---|---|---|
| RF-01 | A página inicial deve apresentar a empresa, a proposta de valor e uma chamada para pedir orçamento na primeira dobra | Essencial | `static/index.html` contém hero com `h1`, texto de apoio, benefícios e CTA para `#lead-form` | Implementado |
| RF-02 | A página deve listar os serviços em cartões padronizados, com atalho para o formulário já com o serviço selecionado | Essencial | Seis cartões de serviço; cada link `[data-select-service]` preenche `#lead-service` e leva ao formulário | Implementado |
| RF-03 | A página deve explicar o processo de atendimento em três etapas | Desejável | Seção “Como funciona” com três cartões: contato, avaliação/orçamento e execução/teste | Implementado |
| RF-04 | A página deve apresentar diferenciais e públicos atendidos | Desejável | Seções “Diferenciais” e “Público atendido” visíveis e sem promessas não verificadas | Implementado |
| RF-05 | A página deve responder dúvidas frequentes em componente nativo acessível | Desejável | Seção FAQ com `<details>`/`<summary>` e respostas em texto | Implementado |
| RF-06 | O formulário deve validar nome, e-mail, serviço e consentimento, com telefone opcional | Essencial | Campos obrigatórios exibem `aria-invalid="true"` e mensagens associadas; erros são anunciados em região `aria-live` | Implementado |
| RF-07 | O formulário deve gerar um resumo local do pedido, sem enviar dados a servidor | Essencial | Ao enviar, a página mostra um resumo com os dados e ações de copiar/abrir canal; nenhuma requisição de rede é feita pelo formulário | Implementado |
| RF-08 | O resumo deve poder ser copiado para a área de transferência | Essencial | Botão “Copiar resumo” copia o texto e informa o resultado | Implementado |
| RF-09 | WhatsApp e e-mail só devem aparecer como canais quando configurados e validados | Essencial | Com `SITE_CONFIG.whatsapp` e `SITE_CONFIG.email` vazios, a página mostra apenas a cópia e uma nota de canais em validação | Implementado |
| RF-10 | A página deve capturar UTMs e permitir pré-seleção de serviço por `?servico=` | Desejável | Campos ocultos recebem os cinco parâmetros; o valor de `servico` correspondente é selecionado no formulário | Implementado |
| RF-11 | A página deve exibir um aviso de privacidade e um modal com a política | Essencial | Banner aparece no primeiro acesso; botão “Entendi” grava a escolha; modal abre e fecha por botão e `Esc` | Implementado |
| RF-12 | O rodapé deve conter um link rotulado exatamente **“Versão antiga”** para o arquivo do site original | Essencial | `static/index.html` contém `<a href="versao-antiga/index.html">Versão antiga</a>` na lista de links e no texto do rodapé | Implementado |
| RF-13 | O arquivo do site original deve ser navegável dentro de `static/versao-antiga/` | Essencial | As páginas inicial, contato e política abrem com ativos locais e links internos reescritos | Implementado |
| RF-14 | O arquivo deve identificar-se como versão histórica e oferecer retorno à nova página | Essencial | Todas as páginas do arquivo exibem faixa “Versão antiga” e link para `../index.html` | Implementado |
| RF-15 | O arquivo deve ser excluído de indexação como se fosse o site atual | Desejável | As três páginas do arquivo contêm `meta name="robots" content="noindex, nofollow"` | Implementado |
| RF-16 | O ano do rodapé deve ser atualizado automaticamente | Desejável | Elemento `[data-current-year]` recebe o ano corrente via JavaScript | Implementado |

## 2. Requisitos não funcionais

| ID | Requisito | Critério de aceitação | Estado |
|---|---|---|---|
| RNF-01 | Publicação estática, sem back-end ou compilação | GitHub Pages publica somente `static/`; não há dependências de npm, bundler ou framework | Implementado |
| RNF-02 | Uma única folha de estilo e um único script | `static/assets/css/styles.css` e `static/assets/js/main.js` são os únicos arquivos desses tipos | Implementado |
| RNF-03 | Sem estilos ou SVGs inline na página principal | `verificar-padrao.ps1` não encontra `style=` nem `<svg>` em `static/*.html` | Implementado |
| RNF-04 | Acessibilidade WCAG 2.2 AA | Foco visível, rótulos explícitos, contraste mínimo, alvos de toque adequados e navegação por teclado | Verificado no padrão; revisão manual pendente |
| RNF-05 | Layout responsivo | Conteúdo legível e utilizável em telas estreitas e largas | Implementado; conferência visual pendente |
| RNF-06 | Privacidade e minimização de dados | Nenhum dado do formulário é persistido ou transmitido; o armazenamento local guarda apenas a escolha do aviso LGPD | Implementado |
| RNF-07 | Conteúdo comercial verificável | Nenhum contato, preço, prazo, marca ou garantia não confirmado é publicado como fato | Implementado com placeholders |
| RNF-08 | Padronização técnica | `verificar-padrao.ps1` aprova os dez invariantes | Aprovado em 2026-11-12 |
| RNF-09 | Desempenho e simplicidade | Sem bibliotecas de terceiros, fontes externas ou scripts de rastreamento | Implementado |
| RNF-10 | Arquivo autocontido | As páginas do arquivo não dependem de scripts ou imagens do Blogger para renderizar | Implementado |
| RNF-11 | Publicação automatizada | `push` em `main` publica apenas `static/` via GitHub Pages; site responde `200` na home e no arquivo | Publicado em 2026-11-12 |

## 3. Conteúdo que permanece pendente

| Item | Situação atual | Ação necessária |
|---|---|---|
| WhatsApp, telefone, e-mail, endereço e horário | Placeholder `[a definir]` no rodapé; `SITE_CONFIG` vazio | Validar com a empresa e preencher |
| Serviços e marcas atuais | Texto genérico baseado no site antigo | Confirmar lista, nomenclatura e autorização de marcas |
| Cobertura por bairro | “Mairiporã e região” | Confirmar abrangência e eventuais taxas de deslocamento |
| Preço, prazo e garantia | “Sob avaliação” / “Sob consulta” | Definir o que pode ser publicado |
| Política de privacidade | Modal com texto próprio da nova página | Revisar com responsável jurídico, se necessário |
| Imagens e marcas do arquivo antigo | Mantidas apenas no arquivo histórico | Confirmar direitos ou restringir a publicação |

## 4. Fora do escopo desta versão

- Módulos demonstrativos, protótipos, calculadoras, agendamento e painel.
- Back-end, CRM, webhook, banco de dados ou envio automático de e-mail.
- Múltiplas páginas de serviços, blog ou catálogo.
- Substituição das imagens e marcas do arquivo antigo.
- Publicação em domínio próprio, analytics e pixels de conversão.

## 5. Rastreabilidade

- Decisões de escopo: [`iniciacao/plano-iniciacao.md`](iniciacao/plano-iniciacao.md).
- Contexto de negócio e lacunas: [`briefing-negocio.md`](briefing-negocio.md).
- Contrato do resumo gerado: [`../lead-schema.json`](../lead-schema.json).
