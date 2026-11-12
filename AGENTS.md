# Instruções do projeto — site-aquecedores-mairipora

Escopo: esta landing page e o arquivo do site original. A iniciação segue a [política de projetos](../../../instrucoes/POLITICA-DE-PROJETOS.md); a estrutura e as evidências seguem a [política organizacional](../../../instrucoes/politica-organizacional.md).

## 1. Regras de conteúdo

1. Os contatos publicados ficam na barra superior e no hero: WhatsApp (11) 99765-1790, telefone fixo (11) 97944-5226 (informado pelo responsável), e-mail aquecedoresmairipora@gmail.com e endereço na Rua Ana Maria C. Camargo, 29 — Jardim Galrão, Mairiporã/SP. Confirme a atualidade antes de divulgar.
2. Não publique preço, prazo, garantia, número ou depoimento que não tenha sido confirmado pelo responsável pela empresa.
3. Não invente horário de atendimento: o site original não informa.
4. Textos e imagens do site antigo são referência histórica e comercial do cliente; não os trate como descrição de outra empresa.
5. Não adicione formulário, analytics, cookies ou armazenamento local sem decisão expressa e atualização da política de privacidade.

## 2. Regras técnicas

1. Publique somente `static/`; não adicione back-end, bundler, framework ou dependência de npm.
2. Mantenha uma única folha (`static/assets/css/styles.css`) e um único script (`static/assets/js/main.js`).
3. Use os ícones de `static/assets/icons/` via `data-icon`; não insira `<svg>` ou `style=` inline em `static/*.html`.
4. Preserve a estética neobrutalista: `data-estilo="neobrutalista"`, bordas de 2 px e sombras sólidas.
5. O logotipo é vetorial (`assets/img/logo-aquecedores-mairipora.svg`). Não volte a usar a imagem raster antiga no cabeçalho.
6. Preserve a visualização única: em telas a partir de 1024 × 620 a página deve caber sem rolagem. Valide qualquer mudança de conteúdo em navegador antes de publicar.
7. Mantenha os contatos na barra superior; não os mova para o rodapé.
8. Execute `pwsh -NoProfile -ExecutionPolicy Bypass -File .\verificar-padrao.ps1` antes de qualquer entrega.
9. Mantenha `lead-schema.json` apenas como contrato reservado; ele não é usado pela página atual.

## 3. Arquivo do site original

1. `static/versao-antiga/` é um artefato histórico: não reescreva o conteúdo editorial das páginas nem “atualize” contatos dentro dele.
2. O link do rodapé da nova página deve continuar rotulado exatamente **“Versão antiga”** e apontar para `versao-antiga/index.html`.
3. As páginas do arquivo devem permanecer com ativos locais, links internos funcionais, faixa de aviso e `noindex, nofollow`.
4. A faixa e os estilos inline do arquivo são uma exceção deliberada ao padrão da nova página; o verificador cobre apenas `static/*.html` de primeiro nível.
5. Não remova a atribuição de direitos: imagens, logotipos e marcas continuam pertencendo aos titulares.
6. A captura de referência em `referencias/fonte-site-atual/` não é publicada e deve permanecer byte a byte como foi capturada.
7. O mapa incorporado do Google Maps em `contato.html` é o único recurso externo do arquivo; não adicione novos embeds ou rastreadores.

## 4. Documentação obrigatória

- Decisões e escopo: `docs/iniciacao/plano-iniciacao.md`.
- Contexto e lacunas comerciais: `docs/briefing-negocio.md`.
- Requisitos e critérios de aceitação: `docs/lista-requisitos.md`.
- Fontes e cópias: `referencias/indice-referencias.md`.
