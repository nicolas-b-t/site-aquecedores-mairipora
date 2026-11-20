"""Exporta a projeção pública do catálogo para o GitHub Pages."""

import json
from pathlib import Path
import sqlite3
from tempfile import TemporaryDirectory

from montar import montar


DESTINO = Path(__file__).resolve().parents[3] / "static" / "assets" / "dados" / "catalogo.json"


def exportar_catalogo(banco):
    with sqlite3.connect(banco) as conexao:
        conexao.row_factory = sqlite3.Row
        fontes = dict(conexao.execute("SELECT id, url FROM fontes ORDER BY id"))
        variantes = conexao.execute("""
            SELECT marca, modelo, fabricante_declarado, familia, somente_referencia,
                   volume_l, pressao_kpa, area_pbe_m2, comprimento_mm, largura_mm,
                   tubos, potencia_eletrica_kw, potencia_termica_btu_h,
                   area_piscina_referencia_m2, volume_piscina_referencia_m3,
                   condicoes_ensaio, observacao, registro_inmetro, fonte_id, pagina
            FROM variantes
            ORDER BY marca, modelo, id
        """)
        produtos = [
            {chave: valor for chave, valor in dict(variante).items() if valor is not None}
            for variante in variantes
        ]
        kits = [
            dict(kit) for kit in conexao.execute("""
                SELECT *, comprimento_mm * largura_mm / 1000000.0 AS area_unitaria_m2
                FROM kits_fabricante ORDER BY volume_l, marca, referencia
            """)
        ]
    return {"fontes": fontes, "produtos": produtos, "kits": kits}


if __name__ == "__main__":
    with TemporaryDirectory() as pasta:
        banco = Path(pasta) / "catalogo.sqlite"
        montar(banco)
        dados = exportar_catalogo(banco)
    DESTINO.parent.mkdir(parents=True, exist_ok=True)
    DESTINO.write_text(
        json.dumps(dados, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )
