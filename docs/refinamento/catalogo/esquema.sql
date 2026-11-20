PRAGMA foreign_keys = ON;

CREATE TABLE fontes (
    id TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    url TEXT NOT NULL,
    arquivo TEXT NOT NULL UNIQUE,
    paginas INTEGER NOT NULL CHECK (paginas > 0),
    sha256 TEXT NOT NULL CHECK (length(sha256) = 64),
    consultada_em TEXT NOT NULL
) STRICT;

CREATE TABLE variantes (
    id INTEGER PRIMARY KEY,
    marca TEXT NOT NULL,
    modelo TEXT NOT NULL,
    fabricante_declarado TEXT NOT NULL,
    familia TEXT NOT NULL CHECK (familia IN (
        'reservatorio', 'coletor_plano', 'coletor_vacuo', 'solar_acoplado',
        'coletor_piscina', 'bomba_calor', 'eletrico_acumulacao'
    )),
    aplicacao TEXT NOT NULL CHECK (aplicacao IN ('banho', 'piscina')),
    somente_referencia INTEGER NOT NULL CHECK (somente_referencia IN (0, 1)),
    volume_l REAL CHECK (volume_l > 0),
    pressao_kpa REAL CHECK (pressao_kpa > 0),
    apoio_eletrico_kw REAL CHECK (apoio_eletrico_kw >= 0),
    area_pbe_m2 REAL CHECK (area_pbe_m2 > 0),
    producao_pbe_kwh_mes REAL CHECK (producao_pbe_kwh_mes > 0),
    comprimento_mm INTEGER CHECK (comprimento_mm > 0),
    largura_mm INTEGER CHECK (largura_mm > 0),
    tubos INTEGER CHECK (tubos > 0),
    potencia_eletrica_kw REAL CHECK (potencia_eletrica_kw > 0),
    potencia_termica_btu_h REAL CHECK (potencia_termica_btu_h > 0),
    area_piscina_referencia_m2 REAL CHECK (area_piscina_referencia_m2 > 0),
    volume_piscina_referencia_m3 REAL CHECK (volume_piscina_referencia_m3 > 0),
    condicoes_ensaio TEXT,
    registro_inmetro TEXT,
    fonte_id TEXT NOT NULL REFERENCES fontes(id),
    pagina INTEGER NOT NULL CHECK (pagina > 0),
    fonte_dimensoes_id TEXT REFERENCES fontes(id),
    pagina_dimensoes INTEGER CHECK (pagina_dimensoes > 0),
    observacao TEXT,
    CHECK ((fonte_dimensoes_id IS NULL) = (pagina_dimensoes IS NULL)),
    CHECK (familia NOT IN ('reservatorio', 'solar_acoplado', 'eletrico_acumulacao') OR volume_l IS NOT NULL)
) STRICT;

CREATE UNIQUE INDEX identidade_tecnica ON variantes (
    marca, modelo, fabricante_declarado, familia, coalesce(registro_inmetro, '')
);

CREATE TABLE kits_fabricante (
    marca TEXT NOT NULL,
    referencia TEXT NOT NULL,
    volume_l INTEGER NOT NULL CHECK (volume_l > 0),
    reservatorio TEXT NOT NULL,
    modelo_coletor TEXT NOT NULL,
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    comprimento_mm INTEGER NOT NULL CHECK (comprimento_mm > 0),
    largura_mm INTEGER NOT NULL CHECK (largura_mm > 0),
    fonte_url TEXT NOT NULL,
    PRIMARY KEY (marca, referencia, volume_l)
) STRICT;
