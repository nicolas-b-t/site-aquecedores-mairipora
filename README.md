# Aquecedores Mairiporã — landing page (`site-aquecedores-mairipora`)

Landing page estática de página única para a **Aquecedores Mairiporã**, com apresentação dos serviços, pedido de orçamento montado no navegador e arquivo navegável do site original.

> **Estado:** primeira versão implementada. Os dados comerciais não confirmados permanecem como placeholder `[a definir]` e os canais de envio estão desativados até validação com a empresa.

## 1. Estrutura

```text
site-aquecedores-mairipora/
├── static/                         # Única pasta publicada
│   ├── index.html                  # Nova landing page
│   ├── assets/
│   │   ├── css/styles.css          # Folha única
│   │   ├── js/main.js              # Script único
│   │   └── icons/                  # Ícones SVG (data-icon)
│   └── versao-antiga/              # Arquivo do site original
│       ├── index.html
│       ├── contato.html
│       ├── politica-de-privacidade.html
│       └── assets/                 # CSS, imagens e fundo locais
├── docs/
│   ├── iniciacao/plano-iniciacao.md
│   ├── briefing-negocio.md
│   └── lista-requisitos.md
├── referencias/
│   ├── fonte-site-atual/           # Captura de referência do Blogger
│   └── indice-referencias.md
├── lead-schema.json                # Contrato do resumo do pedido
├── verificar-padrao.ps1
└── .github/workflows/pages.yml     # Publica apenas static/
```

## 2. O que a página faz

- Apresenta serviços, processo, diferenciais, público e dúvidas frequentes.
- Valida o formulário no navegador (nome, e-mail, serviço e consentimento; telefone opcional).
- Gera um resumo local com os dados do pedido e UTMs, sem enviar nada a servidor.
- Permite copiar o resumo. Os botões de WhatsApp e e-mail só aparecem quando configurados em `SITE_CONFIG`.
- Captura UTMs da URL e aceita `?servico=...` para pré-selecionar um serviço.
- Exibe aviso de privacidade e modal com a política da nova página.
- Mantém a escolha do aviso apenas no `localStorage` (`aqm_lgpd_accepted`).

## 3. Configuração pendente

Antes de publicar, validar com a empresa:

1. **Contatos do rodapé** em `static/index.html`: WhatsApp, telefone, e-mail, endereço e horário estão como `[a definir]`.
2. **Canais de envio** em `static/assets/js/main.js`:

```js
const SITE_CONFIG = {
  brandName: 'Aquecedores Mairiporã',
  whatsapp: '', // DDI + DDD + número, somente dígitos
  email: ''     // e-mail validado
};
```

3. **Serviços, marcas e cobertura** nos textos da página e no FAQ.
4. **Direitos das imagens e marcas** mantidas em `static/versao-antiga/`.

Enquanto os canais estiverem vazios, o formulário mostra apenas o resumo e a opção de copiar, com uma nota de que os canais estão em validação. Nenhum dado é transmitido.

## 4. Versão antiga

O link **“Versão antiga”** fica no rodapé de `static/index.html` — na lista de links e embutido no texto do rodapé — e abre `static/versao-antiga/index.html`.

- As três páginas foram copiadas do site original e tiveram os ativos e links internos reescritos para caminhos locais.
- Scripts, feeds, canônicos e links de autorização do Blogger foram removidos.
- Cada página do arquivo exibe uma faixa de aviso e um link de retorno à nova página.
- As páginas usam `noindex, nofollow` para não competir com a nova landing page.
- A captura de referência preservada está em `referencias/fonte-site-atual/` (`referencias/` não é publicada).
- Imagens, logotipos e marcas do site antigo pertencem aos respectivos titulares. A manutenção pública do arquivo deve ser confirmada pelo responsável.
- `contato.html` mantém o mapa incorporado do Google Maps do site original. É o único recurso externo restante no arquivo e carrega conteúdo de terceiros; se a publicação exigir consentimento prévio, substitua o `iframe` por um link para o mapa.

## 5. Executar e verificar

Não há etapa de build. Para abrir localmente:

```powershell
# Opção 1: abrir diretamente
start .\static\index.html

# Opção 2: servir a pasta (necessário para testar clipboard em alguns navegadores)
python -m http.server 8000 --directory static
```

O clipboard pode exigir um contexto seguro (`http://localhost` ou HTTPS). Em `file://`, o script usa uma alternativa com `document.execCommand`.

Auditoria obrigatória antes da entrega:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File .\verificar-padrao.ps1
```

A auditoria cobre profundidade de pastas, marcadores residuais, `h1` único, estilos/SVGs inline, ícones, schema, arquivo único de CSS/JS, `data-estilo`, contraste e orçamento de CSS.

## 6. Publicação

O workflow `.github/workflows/pages.yml` publica somente `static/`. Não há back-end, banco de dados, analytics ou dependências de terceiros.

## 7. Documentação

- [`docs/iniciacao/plano-iniciacao.md`](docs/iniciacao/plano-iniciacao.md) — decisões, escopo e consulta ao PMBOK.
- [`docs/briefing-negocio.md`](docs/briefing-negocio.md) — contexto, público, oferta e lacunas.
- [`docs/lista-requisitos.md`](docs/lista-requisitos.md) — requisitos funcionais, não funcionais e critérios de aceitação.
- [`referencias/indice-referencias.md`](referencias/indice-referencias.md) — estado das fontes e verificação das cópias.
