# veekun CSV 置き場

ここには `veekun/pokedex` から取得したCSVを置きます。

必要なCSV:

- `pokemon.csv`
- `pokemon_species_names.csv`
- `pokemon_types.csv`
- `pokemon_stats.csv`
- `types.csv`
- `type_names.csv`
- `stats.csv`

参考技タイプも作る場合:

- `moves.csv`
- `pokemon_moves.csv`

変換コマンド例:

```powershell
cd C:\Users\Hiroto\Documents\Codex\2026-06-17\new-chat\outputs\web
python tools\import_veekun.py --csv-dir data\external\veekun --output data\pokemon.json
```
