<#
.SYNOPSIS
  Verifica a conformidade tecnica, organizacional, visual e de acessibilidade do
  template-site-landing-page ou de qualquer projeto derivado dele.

.DESCRIPTION
  Executa 10 invariantes:
    1. Profundidade maxima de subpastas (<= 4 niveis)
    2. Ausencia de marcadores {{CAMPO}} em static/
    3. Exatamente 1 <h1> por pagina
    4. Ausencia de style= e <svg> inline em static/
    5. Todo data-icon possui SVG correspondente
    6. lead-schema.json valido
    7. Arquitetura de arquivo unico (1 CSS e 1 JS)
    8. data-estilo declarado e valido em todas as paginas
    9. Piso de contraste WCAG 2.2 AA (texto, borda funcional e CTA)
   10. Orcamento de tamanho da folha de estilo unica

  Documentacao da camada de estilos: docs/estilos/README.md
#>
$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$Errors = @()

Write-Host "=== Auditoria de Padronizacao: $($ProjectRoot | Split-Path -Leaf) ===" -ForegroundColor Cyan

# 1. Profundidade máxima de pastas autorais; base aprovada preserva caminhos originais.
$approvedBases = @{}
$refsRoot = Join-Path $ProjectRoot 'referencias'
if (Test-Path -LiteralPath $refsRoot -PathType Container) {
  $python = Get-Command python, py -ErrorAction SilentlyContinue | Where-Object { $_.Source -notmatch '[\\/]WindowsApps[\\/]' } | Select-Object -First 1
  Get-ChildItem -LiteralPath $refsRoot -Directory | Where-Object { $_.Name -match '^base-v[0-9]{2}$' } | ForEach-Object {
    $baseVerifier = Join-Path $_.FullName 'verificar-base.py'
    if ($python -and (Test-Path -LiteralPath $baseVerifier -PathType Leaf)) {
      $pythonArgs = if ($python.Name -eq 'py') { @('-3') } else { @() }
      try {
        $null = & $python.Source @pythonArgs $baseVerifier $_.FullName --para-entrega 2>&1
        if ($LASTEXITCODE -eq 0) { $approvedBases[$_.Name] = $true }
      } catch { }
    }
  }
}
$dirs = Get-ChildItem -Path $ProjectRoot -Directory -Recurse | Where-Object { $_.FullName -notmatch '\\\.git(\\|$)' }
foreach ($d in $dirs) {
  $rel = $d.FullName.Substring($ProjectRoot.Length).TrimStart('\')
  $depth = ($rel -split '\\').Count
  if ($depth -gt 4) {
    $parts = $rel -split '[\\/]'
    if ($parts.Count -ge 2 -and $parts[0] -eq 'referencias' -and $approvedBases.ContainsKey($parts[1])) { continue }
    $Errors += "Profundidade > 4 niveis: $rel ($depth niveis); excecao apenas para base aprovada e verificada"
  }
}
Write-Host "[1/10] Profundidade de pastas autorais verificada (max 4 niveis)."

# 2. Ausência de marcadores {{CAMPO}} em static/
$markers = Select-String -Path "$ProjectRoot\static\*.html" -Pattern '\{\{'
if ($markers) {
  foreach ($m in $markers) {
    $Errors += "Marcador {{CAMPO}} residual em $($m.Filename):$($m.LineNumber)"
  }
}
Write-Host "[2/10] Ausencia de marcadores {{CAMPO}} em static/ verificada."

# 3. Exatamente 1 <h1> por página HTML em static/
$htmlFiles = Get-ChildItem "$ProjectRoot\static\*.html"
foreach ($f in $htmlFiles) {
  $h1Count = (Select-String -Path $f.FullName -Pattern '<h1[\s>]').Count
  if ($h1Count -ne 1) {
    $Errors += "Arquivo $($f.Name) possui $h1Count tag(s) <h1> (esperado: 1)"
  }
}
Write-Host "[3/10] Hierarquia de <h1> unico verificada em $($htmlFiles.Count) paginas."

# 4. Ausência de atributos style= e <svg> inline em static/
$inlineStyles = Select-String -Path "$ProjectRoot\static\*.html" -Pattern '\sstyle='
if ($inlineStyles) {
  foreach ($s in $inlineStyles) {
    $Errors += "Atributo style= inline proibido em $($s.Filename):$($s.LineNumber)"
  }
}
$inlineSvgs = Select-String -Path "$ProjectRoot\static\*.html" -Pattern '<svg[\s>]'
if ($inlineSvgs) {
  foreach ($v in $inlineSvgs) {
    $Errors += "Tag <svg> inline encontrada em $($v.Filename):$($v.LineNumber) (use data-icon)"
  }
}
Write-Host "[4/10] Ausencia de estilos inline e SVGs inline verificada."

# 5. Todos os data-icon="..." em static/*.html possuem SVG correspondente em static/assets/icons/
$availableIcons = (Get-ChildItem "$ProjectRoot\static\assets\icons\*.svg").BaseName
$iconMatches = Select-String -Path "$ProjectRoot\static\*.html" -Pattern 'data-icon="([^"]+)"' -AllMatches
$usedIcons = $iconMatches.Matches | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
foreach ($ic in $usedIcons) {
  if ($ic -notin $availableIcons) {
    $Errors += "Icone data-icon='$ic' nao encontrado em static/assets/icons/$ic.svg"
  }
}
Write-Host "[5/10] Integridade de $($usedIcons.Count) icones usados verificada contra $($availableIcons.Count) SVGs disponiveis."

# 6. Validação sintática do lead-schema.json
try {
  $schema = Get-Content "$ProjectRoot\lead-schema.json" -Raw -Encoding UTF8 | ConvertFrom-Json
  if (-not $schema.properties.name -or -not $schema.properties.email) {
    $Errors += "lead-schema.json invalido: propriedades obrigatorias ausentes."
  }
} catch {
  $Errors += "Falha ao converter lead-schema.json: $($_.Exception.Message)"
}
Write-Host "[6/10] Contrato JSON Schema (lead-schema.json) validado."

# 7. Folha de estilos única e script único em static/assets/
$cssFiles = Get-ChildItem "$ProjectRoot\static\assets\css\*.css"
$jsFiles = Get-ChildItem "$ProjectRoot\static\assets\js\*.js"
if ($cssFiles.Count -ne 1 -or $jsFiles.Count -ne 1) {
  $Errors += "Violacao de minimalismo: encontrados $($cssFiles.Count) arquivo(s) CSS e $($jsFiles.Count) arquivo(s) JS (esperado: 1 CSS e 1 JS)."
}
Write-Host "[7/10] Arquitetura de arquivo unico (1 CSS e 1 JS) verificada."

# 8. data-estilo declarado e valido em todas as paginas (camada de estilos visuais)
$validStyles = @('padrao', 'institucional', 'tecnico', 'editorial', 'neobrutalista', 'suico', 'console', 'suave')
foreach ($f in $htmlFiles) {
  $htmlTag = Select-String -Path $f.FullName -Pattern '<html[^>]*>' | Select-Object -First 1
  if (-not $htmlTag) {
    $Errors += "Arquivo $($f.Name) nao possui tag <html>."
    continue
  }
  $styleMatch = [regex]::Match($htmlTag.Line, 'data-estilo="([^"]+)"')
  if (-not $styleMatch.Success) {
    $Errors += "Arquivo $($f.Name) sem atributo data-estilo no <html> (esperado um de: $($validStyles -join ', '))."
  } elseif ($styleMatch.Groups[1].Value -notin $validStyles) {
    $Errors += "Arquivo $($f.Name) usa data-estilo='$($styleMatch.Groups[1].Value)' invalido (permitidos: $($validStyles -join ', '))."
  }
}
Write-Host "[8/10] data-estilo verificado em $($htmlFiles.Count) paginas (permitidos: $($validStyles -join ', '))."

# 9. Piso de contraste WCAG 2.2 AA nos tokens criticos
$cssPath = $cssFiles[0].FullName
$cssText = Get-Content $cssPath -Raw -Encoding UTF8

function Get-TokenBlock {
  param([string]$Css, [string]$SelectorPattern)
  $m = [regex]::Match($Css, "(?s)$SelectorPattern\s*\{([^}]*)\}")
  if (-not $m.Success) { return @{} }
  $hash = @{}
  foreach ($t in [regex]::Matches($m.Groups[1].Value, '--([a-z0-9\-]+):\s*([^;]+);')) {
    $hash[$t.Groups[1].Value.Trim()] = $t.Groups[2].Value.Trim()
  }
  return $hash
}

function Get-Luminance {
  param([string]$Hex)
  $h = $Hex.TrimStart('#')
  if ($h.Length -ne 6) { return $null }
  $values = @()
  foreach ($i in 0, 2, 4) {
    $c = [Convert]::ToInt32($h.Substring($i, 2), 16) / 255
    if ($c -le 0.03928) { $values += ($c / 12.92) } else { $values += [math]::Pow((($c + 0.055) / 1.055), 2.4) }
  }
  return (0.2126 * $values[0]) + (0.7152 * $values[1]) + (0.0722 * $values[2])
}

function Get-ContrastRatio {
  param([string]$HexA, [string]$HexB)
  $la = Get-Luminance $HexA
  $lb = Get-Luminance $HexB
  if ($null -eq $la -or $null -eq $lb) { return $null }
  return [math]::Round((([math]::Max($la, $lb) + 0.05) / ([math]::Min($la, $lb) + 0.05)), 2)
}

$lightTokens = Get-TokenBlock -Css $cssText -SelectorPattern ':root[^{]*'
$darkTokens = Get-TokenBlock -Css $cssText -SelectorPattern 'html\[data-theme="dark"\]'

$contrastChecks = @(
  @{ Theme = 'claro'; Tokens = $lightTokens; Foreground = 'color-text-main'; Background = 'color-bg'; Min = 4.5; Label = 'texto principal' },
  @{ Theme = 'claro'; Tokens = $lightTokens; Foreground = 'color-text-muted'; Background = 'color-bg'; Min = 4.5; Label = 'texto secundario' },
  @{ Theme = 'claro'; Tokens = $lightTokens; Foreground = 'color-cta-text'; Background = 'color-cta'; Min = 4.5; Label = 'texto sobre CTA' },
  @{ Theme = 'claro'; Tokens = $lightTokens; Foreground = 'color-border-functional'; Background = 'color-bg'; Min = 3.0; Label = 'borda funcional' },
  @{ Theme = 'claro'; Tokens = $lightTokens; Foreground = 'color-border-functional'; Background = 'color-surface'; Min = 3.0; Label = 'borda funcional sobre superficie' },
  @{ Theme = 'escuro'; Tokens = $darkTokens; Foreground = 'color-text-main'; Background = 'color-bg'; Min = 4.5; Label = 'texto principal' },
  @{ Theme = 'escuro'; Tokens = $darkTokens; Foreground = 'color-text-muted'; Background = 'color-bg'; Min = 4.5; Label = 'texto secundario' },
  @{ Theme = 'escuro'; Tokens = $darkTokens; Foreground = 'color-cta-text'; Background = 'color-cta'; Min = 4.5; Label = 'texto sobre CTA' },
  @{ Theme = 'escuro'; Tokens = $darkTokens; Foreground = 'color-border-functional'; Background = 'color-bg'; Min = 3.0; Label = 'borda funcional' },
  @{ Theme = 'escuro'; Tokens = $darkTokens; Foreground = 'color-border-functional'; Background = 'color-surface'; Min = 3.0; Label = 'borda funcional sobre superficie' }
)

foreach ($palette in @('terracota-areia', 'vinho-mauve', 'lima-grafite', 'bronze-areia')) {
  $lightBrand = Get-TokenBlock -Css $cssText -SelectorPattern "html\[data-brand=`"$palette`"\]"
  $darkBrand = Get-TokenBlock -Css $cssText -SelectorPattern "html\[data-theme=`"dark`"\]\[data-brand=`"$palette`"\]"
  if (-not $lightBrand['color-accent-ink']) { $lightBrand['color-accent-ink'] = $lightBrand['color-cta'] }
  if (-not $darkBrand['color-accent-ink']) { $darkBrand['color-accent-ink'] = $darkBrand['color-cta'] }
  $lightBrand['color-surface'] = $lightTokens['color-surface']
  $contrastChecks += @{ Theme = "claro/$palette"; Tokens = $lightBrand; Foreground = 'color-cta-text'; Background = 'color-cta'; Min = 4.5; Label = 'texto sobre CTA' }
  $contrastChecks += @{ Theme = "escuro/$palette"; Tokens = $darkBrand; Foreground = 'color-cta-text'; Background = 'color-cta'; Min = 4.5; Label = 'texto sobre CTA' }
  foreach ($surface in @('color-bg', 'color-surface')) {
    $contrastChecks += @{ Theme = "claro/$palette"; Tokens = $lightBrand; Foreground = 'color-accent-ink'; Background = $surface; Min = 4.5; Label = 'texto de acento' }
    $contrastChecks += @{ Theme = "escuro/$palette"; Tokens = $darkBrand; Foreground = 'color-accent-ink'; Background = $surface; Min = 4.5; Label = 'texto de acento' }
  }
}

$contrastCount = 0
foreach ($check in $contrastChecks) {
  $fg = $check.Tokens[$check.Foreground]
  $bg = $check.Tokens[$check.Background]
  if (-not $fg -or -not $bg) {
    $Errors += "Token ausente no tema $($check.Theme): --$($check.Foreground) ou --$($check.Background)"
    continue
  }
  $ratio = Get-ContrastRatio $fg $bg
  if ($null -eq $ratio) { continue }
  $contrastCount++
  if ($ratio -lt $check.Min) {
    $Errors += ("Contraste insuficiente (tema {0}, {1}): {2}:1 < {3}:1 [{4} sobre {5}]" -f $check.Theme, $check.Label, $ratio, $check.Min, $fg, $bg)
  }
}
Write-Host "[9/10] Piso de contraste WCAG 2.2 AA verificado em $contrastCount pares de tokens."

# 10. Orçamento de tamanho da folha de estilo unica
$maxCssKb = 64
$cssKb = [math]::Round($cssFiles[0].Length / 1KB, 1)
if ($cssKb -gt $maxCssKb) {
  $Errors += "Orcamento de CSS excedido: $cssKb KB (teto: $maxCssKb KB). Justifique ou simplifique antes de entregar."
}
Write-Host "[10/10] Orcamento de CSS verificado: $cssKb KB de $maxCssKb KB."

if ($Errors.Count -gt 0) {
  Write-Host "`nFALHA NA AUDITORIA ($($Errors.Count) erro(s)):" -ForegroundColor Red
  $Errors | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
  exit 1
} else {
  Write-Host "`nSUCESSO: Todos os 10 invariantes de padronizacao foram aprovados!" -ForegroundColor Green
  exit 0
}
