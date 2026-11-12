# Aquecedores Mairiporã — landing page (`site-aquecedores-mairipora`)

Landing page estática de **visualização única** para a **Aquecedores Mairiporã**, com estética **neobrutalista**, os dados de contato do site original e o arquivo navegável da versão anterior.

> **Estado:** publicado. Sem formulário e sem coleta de dados: o contato é direto por WhatsApp, telefone e e-mail.

## 0. Publicação

- **Repositório:** <https://github.com/nicolas-b-t/site-aquecedores-mairipora> (público)
- **Site publicado:** <https://nicolas-b-t.github.io/site-aquecedores-mairipora/>
- **Versão antiga:** <https://nicolas-b-t.github.io/site-aquecedores-mairipora/versao-antiga/index.html>
- **Deploy:** workflow `.github/workflows/pages.yml`, disparado a cada `push` em `main`; publica apenas `static/`.

## 1. Estrutura

```text
site-aquecedores-mairipora/
├── static/                         # Única pasta publicada
│   ├── index.html                  # Landing page (uma tela)
│   ├── assets/
│   │   ├── css/styles.css          # Folha única
│   │   ├── js/main.js              # Script único (ano do rodapé)
│   │   ├── icons/                  # Ícones SVG (data-icon)
│   │   └── img/                    # Imagens trazidas do site antigo
│   └── versao-antiga/              # Arquivo do site original
│       ├── index.html
│       ├── contato.html
│       ├── politica-de-privacidade.html
│       └── assets/
├── docs/
│   ├── iniciacao/plano-iniciacao.md
│   ├── briefing-negocio.md
│   └── lista-requisitos.md
├── referencias/
│   ├── fonte-site-atual/           # Captura de referência (não publicada)
│   └── indice-referencias.md
├── lead-schema.json                # Reservado para formulário futuro
├── verificar-padrao.ps1
└── .github/workflows/pages.yml
```

## 2. O que a página tem

- Cabeçalho com logotipo do site original, navegação e botão de WhatsApp.
- Título, texto de apoio e botões de orçamento (WhatsApp) e telefone.
- Nove serviços: solar, elétrico, piscina, banheira, capa térmica, resistência, bombas, filtros e sauna.
- Linha de marcas: Termomax, Heliodin, Solarmax, Tempersol, Industek, Komeco, Tigre e Amanco.
- Galeria com três imagens do site original (aquecimento de piscina, reservatório Termomax e esquema de instalação).
- Faixa de contato com WhatsApp, telefone, e-mail e endereço.
- Rodapé com o link **“Versão antiga”**.

Não há formulário, banner de cookies, analytics, UTM ou armazenamento local.

## 3. Visualização única

O layout usa `100svh` com grade `auto / 1fr / auto / auto` e `overflow: hidden` a partir de 1024 px de largura e 620 px de altura. A coluna de texto é centralizada e a galeria ocupa o restante da tela.

Verificado em navegador headless (Chromium 158) sem rolagem em:

| Viewport | Resultado |
|---|---|
| 1920 × 1080 | sem rolagem |
| 1440 × 900 | sem rolagem |
| 1366 × 768 | sem rolagem |
| 1280 × 720 | sem rolagem |
| 1024 × 768 | sem rolagem |
| 390 × 844 | rolagem vertical (necessária para o conteúdo) |

Em telas pequenas a página flui normalmente, sem cortes.

## 4. Dados publicados

| Canal | Valor | Origem |
|---|---|---|
| WhatsApp | (11) 99765-1790 | site original (2018) |
| Telefone | (11) 4604-5226 | site original (2018) |
| E-mail | aquecedoresmairipora@gmail.com | site original (2018) |
| Endereço | Rua Ana Maria C. Camargo, 29 — Jardim Galrão, Mairiporã/SP | site original (2018) |

Os dados foram trazidos do site anterior e **devem ser confirmados** com o responsável pela empresa. Horário de atendimento não consta no site original e não foi publicado.

## 5. Versão antiga

O link **“Versão antiga”** fica no rodapé de `static/index.html` e abre `static/versao-antiga/index.html`.

- As três páginas foram copiadas do site original e tiveram ativos e links internos reescritos para caminhos locais.
- Scripts, feeds, canônicos e links de autorização do Blogger foram removidos.
- Cada página exibe faixa de aviso e link de retorno à nova página.
- As páginas usam `noindex, nofollow` para não competir com a landing page.
- A captura de referência está em `referencias/fonte-site-atual/` (não publicada).
- `contato.html` mantém o mapa incorporado do Google Maps do original; é o único recurso externo do arquivo.
- Imagens, logotipos e marcas pertencem aos respectivos titulares.

## 6. Executar e verificar

Não há etapa de build. Para abrir localmente:

```powershell
start .\static\index.html

# ou servir a pasta
python -m http.server 8000 --directory static
```

Auditoria obrigatória antes da entrega:

```powershell
pwsh -NoProfile -ExecutionPolicy Bypass -File .\verificar-padrao.ps1
```

A auditoria cobre profundidade de pastas, marcadores residuais, `h1` único, estilos/SVGs inline, ícones, schema, arquivo único de CSS/JS, `data-estilo`, contraste e orçamento de CSS.

## 7. Publicação

```powershell
git add -A
git commit -m "descrição da alteração"
git push
```

## 8. Documentação

- [`docs/iniciacao/plano-iniciacao.md`](docs/iniciacao/plano-iniciacao.md) — decisões, escopo e consulta ao PMBOK.
- [`docs/briefing-negocio.md`](docs/briefing-negocio.md) — contexto, público, oferta e lacunas.
- [`docs/lista-requisitos.md`](docs/lista-requisitos.md) — requisitos e critérios de aceitação.
- [`referencias/indice-referencias.md`](referencias/indice-referencias.md) — fontes e verificação das cópias.
