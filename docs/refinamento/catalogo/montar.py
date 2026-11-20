"""Gera a base de pesquisa a partir dos CSVs, usando apenas a biblioteca padrão."""

import argparse
import csv
from pathlib import Path
import sqlite3
import tempfile


PASTA = Path(__file__).resolve().parent


def importar(conexao, tabela):
    with (PASTA / f"{tabela}.csv").open(encoding="utf-8", newline="") as arquivo:
        leitor = csv.DictReader(arquivo)
        colunas = leitor.fieldnames
        marcadores = ", ".join("?" for _ in colunas)
        comando = f"INSERT INTO {tabela} ({', '.join(colunas)}) VALUES ({marcadores})"
        conexao.executemany(
            comando, ([linha[coluna] or None for coluna in colunas] for linha in leitor)
        )


def montar(destino):
    with tempfile.TemporaryDirectory(dir=destino.parent) as pasta:
        arquivo = Path(pasta) / destino.name
        conexao = sqlite3.connect(arquivo)
        try:
            with conexao:
                conexao.executescript((PASTA / "esquema.sql").read_text(encoding="utf-8"))
                importar(conexao, "fontes")
                importar(conexao, "variantes")
                importar(conexao, "kits_fabricante")
            if conexao.execute("PRAGMA integrity_check").fetchone() != ("ok",):
                raise RuntimeError("Falha de integridade da base SQLite")
            if conexao.execute("PRAGMA foreign_key_check").fetchone() is not None:
                raise RuntimeError("A base contém referências inválidas")
            paginas_invalidas = conexao.execute("""
                SELECT variantes.id FROM variantes
                JOIN fontes ON fontes.id = variantes.fonte_id
                LEFT JOIN fontes AS dimensoes ON dimensoes.id = variantes.fonte_dimensoes_id
                WHERE variantes.pagina > fontes.paginas
                   OR variantes.pagina_dimensoes > dimensoes.paginas
            """).fetchall()
            if paginas_invalidas:
                raise RuntimeError(f"Páginas fora dos documentos de origem: {paginas_invalidas}")
            kits_invalidos = conexao.execute("""
                SELECT kits.marca, kits.referencia, kits.volume_l
                FROM kits_fabricante AS kits
                WHERE NOT EXISTS (
                    SELECT 1 FROM variantes
                    WHERE variantes.marca = kits.marca
                      AND variantes.modelo = kits.modelo_coletor
                      AND variantes.familia = 'coletor_plano'
                )
            """).fetchall()
            if kits_invalidos:
                raise RuntimeError(f"Kits com coletores ausentes no catálogo: {kits_invalidos}")
        finally:
            conexao.close()
        arquivo.replace(destino)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--saida", type=Path, required=True, help="Caminho para o novo SQLite")
    args = parser.parse_args()
    if args.saida.exists():
        parser.error("O arquivo de saída já existe. Escolha outro caminho.")
    montar(args.saida.resolve())
