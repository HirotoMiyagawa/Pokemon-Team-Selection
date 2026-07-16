#!/usr/bin/env python3
"""Convert selected veekun/pokedex CSV files into this app's pokemon.json.

Usage:
  python tools/import_veekun.py --csv-dir path/to/pokedex/pokedex/data/csv

The script intentionally imports only stable base data:
Pokemon names, types, base stats, and a simple reference move type list.
It does not import usage rates, Champions availability, natures, items, or EV data.
"""

from __future__ import annotations

import argparse
import csv
import json
from collections import defaultdict
from datetime import date
from pathlib import Path


APP_TYPE_NAMES = {
    "normal": "\u30ce\u30fc\u30de\u30eb",
    "fighting": "\u304b\u304f\u3068\u3046",
    "flying": "\u3072\u3053\u3046",
    "poison": "\u3069\u304f",
    "ground": "\u3058\u3081\u3093",
    "rock": "\u3044\u308f",
    "bug": "\u3080\u3057",
    "ghost": "\u30b4\u30fc\u30b9\u30c8",
    "steel": "\u306f\u304c\u306d",
    "fire": "\u307b\u306e\u304a",
    "water": "\u307f\u305a",
    "grass": "\u304f\u3055",
    "electric": "\u3067\u3093\u304d",
    "psychic": "\u30a8\u30b9\u30d1\u30fc",
    "ice": "\u3053\u304a\u308a",
    "dragon": "\u30c9\u30e9\u30b4\u30f3",
    "dark": "\u3042\u304f",
    "fairy": "\u30d5\u30a7\u30a2\u30ea\u30fc",
}

STAT_KEYS = {
    "hp": "hp",
    "attack": "attack",
    "defense": "defense",
    "special-attack": "spAttack",
    "special-defense": "spDefense",
    "speed": "speed",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8", newline="") as file:
        return list(csv.DictReader(file))


def require_files(csv_dir: Path, names: list[str]) -> None:
    missing = [name for name in names if not (csv_dir / name).exists()]
    if missing:
        joined = ", ".join(missing)
        raise SystemExit(f"Missing required veekun CSV file(s): {joined}")


def preferred_names(rows: list[dict[str, str]], id_field: str) -> dict[int, str]:
    names_by_id: dict[int, dict[int, str]] = defaultdict(dict)
    for row in rows:
        name = row.get("name", "").strip()
        if not name:
            continue
        names_by_id[int(row[id_field])][int(row["local_language_id"])] = name

    result = {}
    for key, localized in names_by_id.items():
        # veekun has used both Japanese kana and Japanese language IDs.
        result[key] = localized.get(1) or localized.get(11) or localized.get(9) or next(iter(localized.values()))
    return result


def build_type_maps(csv_dir: Path) -> tuple[dict[int, str], dict[int, str]]:
    types = {int(row["id"]): row["identifier"] for row in read_csv(csv_dir / "types.csv")}
    type_names = preferred_names(read_csv(csv_dir / "type_names.csv"), "type_id")
    app_names = {}
    for type_id, identifier in types.items():
        app_names[type_id] = APP_TYPE_NAMES.get(identifier) or type_names.get(type_id) or identifier
    return types, app_names


def build_stat_maps(csv_dir: Path) -> tuple[dict[int, str], dict[int, dict[str, int]]]:
    stat_identifiers = {int(row["id"]): row["identifier"] for row in read_csv(csv_dir / "stats.csv")}
    stats_by_pokemon: dict[int, dict[str, int]] = defaultdict(dict)
    for row in read_csv(csv_dir / "pokemon_stats.csv"):
        identifier = stat_identifiers.get(int(row["stat_id"]))
        key = STAT_KEYS.get(identifier or "")
        if key:
            stats_by_pokemon[int(row["pokemon_id"])][key] = int(row["base_stat"])
    return stat_identifiers, stats_by_pokemon


def build_reference_move_types(csv_dir: Path, type_names: dict[int, str]) -> dict[int, list[str]]:
    if not (csv_dir / "pokemon_moves.csv").exists() or not (csv_dir / "moves.csv").exists():
        return {}

    move_type_by_move = {
        int(row["id"]): int(row["type_id"])
        for row in read_csv(csv_dir / "moves.csv")
        if row.get("type_id")
    }
    counts: dict[int, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for row in read_csv(csv_dir / "pokemon_moves.csv"):
        move_id = int(row["move_id"])
        type_name = type_names.get(move_type_by_move.get(move_id, -1))
        if type_name:
            counts[int(row["pokemon_id"])][type_name] += 1

    result = {}
    for pokemon_id, type_counts in counts.items():
        result[pokemon_id] = [
            type_name
            for type_name, _count in sorted(type_counts.items(), key=lambda item: (-item[1], item[0]))[:4]
        ]
    return result


def convert(csv_dir: Path, include_forms: bool) -> list[dict[str, object]]:
    required = [
        "pokemon.csv",
        "pokemon_species_names.csv",
        "pokemon_types.csv",
        "pokemon_stats.csv",
        "types.csv",
        "type_names.csv",
        "stats.csv",
    ]
    require_files(csv_dir, required)

    pokemon_rows = read_csv(csv_dir / "pokemon.csv")
    species_names = preferred_names(read_csv(csv_dir / "pokemon_species_names.csv"), "pokemon_species_id")
    _type_identifiers, type_names = build_type_maps(csv_dir)
    _stat_identifiers, stats_by_pokemon = build_stat_maps(csv_dir)
    reference_move_types = build_reference_move_types(csv_dir, type_names)

    types_by_pokemon: dict[int, list[str]] = defaultdict(list)
    for row in sorted(read_csv(csv_dir / "pokemon_types.csv"), key=lambda item: (int(item["pokemon_id"]), int(item["slot"]))):
        type_name = type_names.get(int(row["type_id"]))
        if type_name:
            types_by_pokemon[int(row["pokemon_id"])].append(type_name)

    records = []
    for row in pokemon_rows:
        if not include_forms and row.get("is_default") != "1":
            continue

        pokemon_id = int(row["id"])
        species_id = int(row["species_id"])
        name = species_names.get(species_id) or row["identifier"]
        types = types_by_pokemon.get(pokemon_id, [])
        if not types:
            continue

        moves = reference_move_types.get(pokemon_id) or types
        records.append(
            {
                "id": row["identifier"],
                "name": name,
                "types": types,
                "baseStats": stats_by_pokemon.get(pokemon_id, {}),
                "referenceMoveTypes": moves,
                "updatedAt": date.today().isoformat(),
            }
        )

    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv-dir", required=True, type=Path, help="Path to veekun/pokedex/pokedex/data/csv")
    parser.add_argument("--output", type=Path, default=Path("data/pokemon.json"))
    parser.add_argument("--include-forms", action="store_true", help="Include non-default forms from pokemon.csv")
    args = parser.parse_args()

    records = convert(args.csv_dir, args.include_forms)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(records)} records to {args.output}")


if __name__ == "__main__":
    main()
