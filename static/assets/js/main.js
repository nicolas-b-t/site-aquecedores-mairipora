'use strict';

const litrosPorBanho = 100;
const unidadesPorPagina = 12;
const formatoBr = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const numeroBr = (valor) => formatoBr.format(valor);
const familias = {
  reservatorio: 'Reservatório solar',
  coletor_plano: 'Coletor plano para banho',
  coletor_vacuo: 'Coletor a vácuo para banho',
  solar_acoplado: 'Solar a vácuo integrado',
  eletrico_acumulacao: 'Elétrico por acumulação',
  coletor_piscina: 'Coletor solar para piscina',
  bomba_calor: 'Bomba de calor para piscina',
};

function elemento(tag, texto) {
  const no = document.createElement(tag);
  no.textContent = texto;
  return no;
}

function nomeProduto(produto) {
  return `${produto.marca} ${produto.modelo}`;
}

function referenciasPorVolume(produtos, familia, litros) {
  const candidatos = produtos.filter((produto) => produto.familia === familia && produto.volume_l >= litros);
  if (!candidatos.length) return [];
  const minimo = Math.min(...candidatos.map((produto) => produto.volume_l));
  return candidatos.filter((produto) => produto.volume_l === minimo);
}

function listarModelos(produtos) {
  const modelos = [...new Set(produtos.map(nomeProduto))];
  const texto = modelos.slice(0, 3).join('; ');
  return modelos.length > 3 ? `${texto} e mais ${modelos.length - 3} na faixa` : texto;
}

function mostrarResultado(resultado, { linhas, resumo, fonteKit }) {
  const lista = elemento('ul', '');
  lista.append(...linhas.map((linha) => elemento('li', linha)));
  const contato = elemento('a', 'Abrir resumo no WhatsApp');
  contato.className = 'btn btn-secondary';
  const url = new URL('https://wa.me/5511997651790');
  url.searchParams.set('text', resumo.join('\n'));
  contato.href = url.href;
  resultado.replaceChildren(elemento('h3', 'Análise preliminar'), lista);
  if (fonteKit) {
    const fonte = elemento('a', 'Conferir a composição do kit no fabricante');
    fonte.href = fonteKit;
    resultado.append(fonte, elemento('br', ''));
  }
  resultado.append(contato);
  resultado.hidden = false;
  resultado.focus();
}

function analiseBanho(campos, catalogo) {
  const pessoas = campos.pessoas.valueAsNumber;
  const banhos = campos.banhos.valueAsNumber;
  const litros = banhos * litrosPorBanho;
  const eletrico = campos.tipo.value === 'eletrico';
  const demanda = `${numeroBr(litros)} L/dia pela premissa de ${litrosPorBanho} L por banho.`;
  const linhas = [demanda];
  const resumo = [
    'Olá! Gostaria de um orçamento de aquecimento para banho.',
    `${pessoas} pessoa(s) na residência, ${banhos} banho(s) por dia. ${demanda}`,
    `Preferência: ${eletrico ? 'elétrico' : 'solar'}.`,
  ];
  const faces = eletrico ? [] : ['leste', 'oeste'].flatMap((face) => {
    const area = campos[face].valueAsNumber;
    return area > 0 ? [{ face, area }] : [];
  });
  if (!eletrico) {
    const telhado = faces.length
      ? `Área útil informada: ${faces.map(({ face, area }) => `${face} ${numeroBr(area)} m²`).join(', ')}.`
      : 'Área útil do telhado a confirmar.';
    linhas.push(telhado);
    resumo.push(telhado);
  }

  if (!catalogo) {
    linhas.push('O catálogo está temporariamente indisponível. Você pode encaminhar as medidas para a loja.');
    return { linhas, resumo };
  }

  const modelos = referenciasPorVolume(
    catalogo.produtos, eletrico ? 'eletrico_acumulacao' : 'reservatorio', litros
  );
  const categoria = eletrico ? 'Elétrico por acumulação' : 'Boiler solar';
  if (modelos.length) {
    const referencia = `${categoria}: ${numeroBr(modelos[0].volume_l)} L nominais na menor faixa consultada. Exemplos: ${listarModelos(modelos)}.`;
    linhas.push(referencia);
    resumo.push(referencia);
  } else {
    linhas.push(`${categoria}: o catálogo não tem uma referência nessa capacidade ou acima. A loja pode avaliar outra configuração.`);
  }
  if (eletrico) {
    linhas.push('Para confirmar o elétrico por acumulação, a loja verifica a alimentação elétrica e o tempo de recuperação entre banhos.');
    return { linhas, resumo };
  }

  const kit = catalogo.kits.find((item) => item.volume_l >= litros);
  if (kit) {
    const dim = `${numeroBr(kit.largura_mm / 1000)} × ${numeroBr(kit.comprimento_mm / 1000)} m`;
    const coletor = `Kit de referência ${kit.marca}: boiler de ${kit.volume_l} L (${kit.reservatorio}) e ${kit.quantidade} coletores planos ${kit.modelo_coletor} (${dim} por peça).`;
    const areaPlacas = kit.quantidade * kit.area_unitaria_m2;
    linhas.push(coletor);
    resumo.push(coletor);
    if (faces.length && faces.every(({ area }) => area < areaPlacas)) {
      linhas.push(`Nenhuma face informada tem os ${numeroBr(areaPlacas)} m² correspondentes à soma das placas. A loja pode avaliar outra disposição.`);
    } else {
      linhas.push(`As placas do kit somam ${numeroBr(areaPlacas)} m². Confirme dimensões livres, recuos e orientação para verificar a implantação em leste ou oeste.`);
    }
  } else {
    linhas.push('A quantidade de coletores planos depende de um arranjo documentado para essa capacidade e das condições do telhado.');
  }
  const acoplados = referenciasPorVolume(catalogo.produtos, 'solar_acoplado', litros);
  linhas.push(acoplados.length
    ? `Vácuo integrado: conjunto de ${numeroBr(acoplados[0].volume_l)} L na menor faixa consultada. Exemplos: ${listarModelos(acoplados)}.`
    : 'Vácuo integrado: nenhuma referência do catálogo atinge a demanda calculada.');
  const vacuoSeparado = catalogo.produtos
    .filter((produto) => produto.familia === 'coletor_vacuo' && produto.comprimento_mm && produto.largura_mm);
  if (vacuoSeparado.length) {
    linhas.push(`Vácuo separado: exemplos com dimensões documentadas incluem ${listarModelos(vacuoSeparado)}. A quantidade depende do arranjo, da pressão e da avaliação do telhado.`);
  }
  return { linhas, resumo, fonteKit: kit?.fonte_url };
}

function analisePiscina(campos, catalogo) {
  const formato = campos.formato.value;
  const comprimento = campos.comprimento.valueAsNumber;
  const largura = formato === 'circular' ? comprimento : campos.largura.valueAsNumber;
  const profundidade = campos.profundidade.valueAsNumber;
  const area = comprimento * largura * (formato === 'retangular' ? 1 : Math.PI / 4);
  const volume = area * profundidade;
  const medidas = `${numeroBr(area)} m² de espelho d’água e ${numeroBr(volume)} m³ (≈ ${Math.round(volume * 1000).toLocaleString('pt-BR')} L).`;
  const temperatura = campos.temperatura.valueAsNumber;
  const capa = campos.capa.value;
  const linhas = [medidas];
  const resumo = [
    'Olá! Gostaria de um orçamento para aquecer uma piscina.',
    `Formato: ${formato === 'eliptica' ? 'elíptica' : formato}. ${medidas}`,
    Number.isFinite(temperatura) ? `Temperatura desejada: ${numeroBr(temperatura)} °C.` : 'Temperatura desejada a confirmar.',
    capa ? `Capa térmica: ${capa}.` : 'Uso de capa a confirmar.',
  ];
  if (catalogo) {
    const candidatos = catalogo.produtos
      .filter((produto) => produto.familia === 'bomba_calor'
        && produto.area_piscina_referencia_m2 >= area
        && produto.volume_piscina_referencia_m3 >= volume)
      .sort((a, b) => a.potencia_termica_btu_h - b.potencia_termica_btu_h);
    if (candidatos.length) {
      const primeiro = candidatos[0];
      linhas.push(`Bomba de calor para avaliar: ${nomeProduto(primeiro)}. A ficha indica ${numeroBr(primeiro.area_piscina_referencia_m2)} m² e ${numeroBr(primeiro.volume_piscina_referencia_m3)} m³ de referência. ${primeiro.condicoes_ensaio}`);
    } else {
      linhas.push('As faixas de área e volume declaradas nas fichas disponíveis não cobrem este caso. Consulte a loja para avaliar o equipamento.');
    }
    linhas.push('Solar para piscina: consulte os coletores no catálogo. Para estimar quantidade, a loja verifica exposição, espaço de instalação e estação de uso.');
  } else {
    linhas.push('O catálogo está temporariamente indisponível. Você pode encaminhar as medidas para a loja.');
  }
  linhas.push('A avaliação do aquecimento também considera o ambiente, o vento, o uso de capa e a temperatura desejada.');
  return { linhas, resumo };
}

function detalhesProduto(produto) {
  return [
    ['volume_l', 'L nominais'],
    ['area_pbe_m2', 'm² declarados no PBE'],
    ['pressao_kpa', 'kPa'],
    ['tubos', 'tubos'],
    ['potencia_eletrica_kw', 'kW elétricos'],
    ['potencia_termica_btu_h', 'BTU/h térmicos'],
    ['area_piscina_referencia_m2', 'm² de piscina (referência)'],
    ['volume_piscina_referencia_m3', 'm³ de piscina (referência)'],
  ].flatMap(([chave, unidade]) => produto[chave] == null ? [] : [`${numeroBr(produto[chave])} ${unidade}`]);
}

function ativarCatalogo(catalogo) {
  const busca = document.querySelector('#buscar-produto');
  const familia = document.querySelector('#familia-produto');
  const lista = document.querySelector('#itens-catalogo');
  const mais = document.querySelector('#mais-produtos');
  const status = document.querySelector('#status-catalogo');
  const normalizar = (texto) => texto.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  let limite = unidadesPorPagina;

  for (const [id, rotulo] of Object.entries(familias)) {
    const opcao = elemento('option', rotulo);
    opcao.value = id;
    familia.append(opcao);
  }
  const itens = catalogo.produtos.map((produto) => ({
    produto, busca: normalizar(nomeProduto(produto)),
  }));
  function atualizar() {
    const termos = normalizar(busca.value).trim().split(/\s+/);
    const filtrados = itens.filter((item) =>
      (!familia.value || item.produto.familia === familia.value)
      && termos.every((termo) => item.busca.includes(termo)));
    const visiveis = filtrados.slice(0, limite);
    lista.replaceChildren(...visiveis.map(({ produto }) => {
      const card = elemento('li', '');
      const titulo = elemento('h3', nomeProduto(produto));
      const tipo = elemento('p', familias[produto.familia]);
      const medidas = elemento('p', detalhesProduto(produto).join(' · '));
      const url = new URL(catalogo.fontes[produto.fonte_id]);
      const pdf = url.pathname.includes('.pdf');
      const fonte = elemento('a', pdf ? `Consultar fonte (p. ${produto.pagina})` : 'Consultar fonte');
      if (pdf) url.hash = `page=${produto.pagina}`;
      fonte.href = url.href;
      card.append(titulo, tipo, medidas);
      if (produto.somente_referencia) card.append(elemento('p', 'Referência de mercado'));
      if (produto.condicoes_ensaio) card.append(elemento('p', produto.condicoes_ensaio));
      if (produto.observacao) card.append(elemento('p', produto.observacao));
      card.append(fonte);
      return card;
    }));
    mais.hidden = visiveis.length === filtrados.length;
    status.textContent = filtrados.length
      ? `Exibindo ${visiveis.length} de ${filtrados.length} modelos e variantes.`
      : 'Nenhum modelo encontrado para esses filtros.';
  }
  function filtrar() {
    limite = unidadesPorPagina;
    atualizar();
  }
  busca.addEventListener('input', filtrar);
  familia.addEventListener('change', filtrar);
  mais.addEventListener('click', () => { limite += unidadesPorPagina; atualizar(); });
  document.querySelector('[data-filtros]').hidden = false;
  atualizar();
}

function ativarCalculadora(formulario, resultado, catalogo, calcular) {
  let revisao = 0;
  formulario.hidden = false;
  formulario.addEventListener('input', () => {
    revisao += 1;
    resultado.hidden = true;
  });
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const atual = ++revisao;
    const dados = await catalogo;
    if (atual !== revisao) return;
    mostrarResultado(resultado, calcular(formulario.elements, dados));
  });
}

function carregarFerramentas() {
  const banho = document.querySelector('#calcular-banho');
  if (!banho) return;
  const piscina = document.querySelector('#calcular-piscina');
  const catalogo = fetch('assets/dados/catalogo.json', { signal: AbortSignal.timeout(8000) })
    .then((resposta) => {
      if (!resposta.ok) throw new Error('Catálogo indisponível');
      return resposta.json();
    })
    .catch(() => null);

  function mostrarTelhado() {
    const eletrico = banho.elements.tipo.value === 'eletrico';
    const telhado = banho.querySelector('[data-telhado]');
    telhado.hidden = eletrico;
    telhado.disabled = eletrico;
  }
  function mostrarLargura() {
    const circular = piscina.elements.formato.value === 'circular';
    piscina.querySelector('[data-comprimento]').textContent = circular ? 'Diâmetro interno (m)' : 'Comprimento interno (m)';
    piscina.querySelector('[data-campo-largura]').hidden = circular;
    piscina.elements.largura.disabled = circular;
  }
  banho.elements.tipo.addEventListener('change', mostrarTelhado);
  piscina.elements.formato.addEventListener('change', mostrarLargura);
  mostrarTelhado();
  mostrarLargura();
  ativarCalculadora(banho, document.querySelector('[data-resultado="banho"]'), catalogo, analiseBanho);
  ativarCalculadora(piscina, document.querySelector('[data-resultado="piscina"]'), catalogo, analisePiscina);
  catalogo.then((dados) => {
    if (dados) ativarCatalogo(dados);
    else document.querySelector('#status-catalogo').textContent = 'O catálogo está indisponível. Você pode continuar usando os cálculos.';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const currentYear = String(new Date().getFullYear());

  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = currentYear;
  });
  carregarFerramentas();
});
