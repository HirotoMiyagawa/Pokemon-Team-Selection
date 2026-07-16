# データベース編集ガイド

このフォルダには、Web版アプリで使う手入力データを置きます。

## ファイル

- `pokemon.json`: ポケモンの基本情報、タイプ、種族値、参考技タイプ

## 編集方針

- まずは安定して使える基礎データだけを整備します。
- 外部サイトの文章や採用率データは取り込みません。
- ポケモンチャンピオンズ固有の内定一覧や採用率は管理対象外にします。
- 不明な値は空欄や空配列にして、無理に推測しません。

## pokemon.json の項目

- `id`: 英数字の管理用ID
- `name`: 表示名
- `types`: タイプ。単タイプの場合は1つだけ入れます。
- `baseStats`: 種族値
- `referenceMoveTypes`: 選出判定で使う参考技タイプ
- `updatedAt`: 更新日

## 追加例

```json
{
  "id": "pikachu",
  "name": "ピカチュウ",
  "types": ["でんき"],
  "baseStats": {"hp": 35, "attack": 55, "defense": 40, "spAttack": 50, "spDefense": 50, "speed": 90},
  "referenceMoveTypes": ["でんき", "ノーマル"],
  "updatedAt": "2026-07-16"
}
```
