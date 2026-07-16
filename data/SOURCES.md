# データソース

## veekun/pokedex

基本DBの元データとして、以下の公開リポジトリを利用できます。

- Repository: https://github.com/veekun/pokedex
- CSV directory: `pokedex/data/csv`
- License: MIT License

このアプリでは、veekun のCSVから以下の安定した基礎データだけを使う方針です。

- ポケモン名
- タイプ
- 種族値
- 覚える技のタイプから作る参考技タイプ

以下は取り込みません。

- ポケモンチャンピオンズの内定ポケモン一覧
- 採用率
- 性格採用率
- 持ち物採用率
- 技採用率
- 能力ポイント採用率

## 注意

veekun/pokedex のプログラム部分は MIT License です。一方で、収録されているポケモン関連データはゲーム由来の情報を含むため、公開アプリで使う場合は出典を明記し、画像や説明文の丸写しを避けます。
