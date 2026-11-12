# Instruções do projeto — site-aquecedores-mairipora

Escopo: esta landing page e o arquivo do site original. A iniciação segue a [política de projetos](../../../instrucoes/POLITICA-DE-PROJETOS.md); a estrutura e as evidências seguem a [política organizacional](../../../instrucoes/politica-organizacional.md).

## 1. Regras de conteúdo

1. Não publique como fato nenhum contato, preço, prazo, garantia, marca ou número que não tenha sido confirmado pelo responsável pela empresa.
2. Mantenha os placeholders `[a definir]` no rodapé e os campos vazios em `SITE_CONFIG` até a validação. O formulário deve continuar funcional apenas com o resumo local.
3. Textos do site antigo são referência histórica. Não os trate como descrição atual do negócio.
4. Preserve a privacidade: nenhum dado do formulário pode ser enviado, persistido ou incluído em analytics sem decisão expressa e atualização da política.

## 2. Regras técnicas

1. Publique somente `static/`; não adicione back-end, bundler, framework ou dependência de npm sem decisão expressa.
2. Mantenha uma única folha (`static/assets/css/styles.css`) e um único script (`static/assets/js/main.js`).
3. Use os ícones de `static/assets/icons/` via `data-icon`; não insira `<svg>` ou `style=` inline em `static/*.html`.
4. Preserve a estrutura de seções e cartões descrita em `docs/lista-requisitos.md` e no padrão do template.
5. Execute `pwsh -NoProfile -ExecutionPolicy Bypass -File .\verificar-padrao.ps1` antes de qualquer entrega.
6. Mantenha `lead-schema.json` alinhado aos campos reais do formulário.

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
