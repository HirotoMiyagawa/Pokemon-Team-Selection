"use strict";

const TYPES = [
  "なし", "ノーマル", "ほのお", "みず", "でんき", "くさ", "こおり", "かくとう", "どく",
  "じめん", "ひこう", "エスパー", "むし", "いわ", "ゴースト", "ドラゴン",
  "あく", "はがね", "フェアリー"
];

let TYPE_CHART = {
  "ノーマル": {"いわ": 0.5, "ゴースト": 0, "はがね": 0.5},
  "ほのお": {"ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 2, "むし": 2, "いわ": 0.5, "ドラゴン": 0.5, "はがね": 2},
  "みず": {"ほのお": 2, "みず": 0.5, "くさ": 0.5, "じめん": 2, "いわ": 2, "ドラゴン": 0.5},
  "でんき": {"みず": 2, "でんき": 0.5, "くさ": 0.5, "じめん": 0, "ひこう": 2, "ドラゴン": 0.5},
  "くさ": {"ほのお": 0.5, "みず": 2, "くさ": 0.5, "どく": 0.5, "じめん": 2, "ひこう": 0.5, "むし": 0.5, "いわ": 2, "ドラゴン": 0.5, "はがね": 0.5},
  "こおり": {"ほのお": 0.5, "みず": 0.5, "くさ": 2, "こおり": 0.5, "じめん": 2, "ひこう": 2, "ドラゴン": 2, "はがね": 0.5},
  "かくとう": {"ノーマル": 2, "こおり": 2, "どく": 0.5, "ひこう": 0.5, "エスパー": 0.5, "むし": 0.5, "いわ": 2, "ゴースト": 0, "あく": 2, "はがね": 2, "フェアリー": 0.5},
  "どく": {"くさ": 2, "どく": 0.5, "じめん": 0.5, "いわ": 0.5, "ゴースト": 0.5, "はがね": 0, "フェアリー": 2},
  "じめん": {"ほのお": 2, "でんき": 2, "くさ": 0.5, "どく": 2, "ひこう": 0, "むし": 0.5, "いわ": 2, "はがね": 2},
  "ひこう": {"でんき": 0.5, "くさ": 2, "かくとう": 2, "むし": 2, "いわ": 0.5, "はがね": 0.5},
  "エスパー": {"かくとう": 2, "どく": 2, "エスパー": 0.5, "あく": 0, "はがね": 0.5},
  "むし": {"ほのお": 0.5, "くさ": 2, "かくとう": 0.5, "どく": 0.5, "ひこう": 0.5, "エスパー": 2, "ゴースト": 0.5, "あく": 2, "はがね": 0.5, "フェアリー": 0.5},
  "いわ": {"ほのお": 2, "こおり": 2, "かくとう": 0.5, "じめん": 0.5, "ひこう": 2, "むし": 2, "はがね": 0.5},
  "ゴースト": {"ノーマル": 0, "エスパー": 2, "ゴースト": 2, "あく": 0.5},
  "ドラゴン": {"ドラゴン": 2, "はがね": 0.5, "フェアリー": 0},
  "あく": {"かくとう": 0.5, "エスパー": 2, "ゴースト": 2, "あく": 0.5, "フェアリー": 0.5},
  "はがね": {"ほのお": 0.5, "みず": 0.5, "でんき": 0.5, "こおり": 2, "いわ": 2, "はがね": 0.5, "フェアリー": 2},
  "フェアリー": {"ほのお": 0.5, "かくとう": 2, "どく": 0.5, "ドラゴン": 2, "あく": 2, "はがね": 0.5}
};

let POKEMON_DB = [
  ["カイリュー", "ドラゴン", "ひこう", ["ドラゴン", "ひこう", "ノーマル"]],
  ["ガブリアス", "ドラゴン", "じめん", ["じめん", "ドラゴン", "いわ", "どく"]],
  ["サーフゴー", "はがね", "ゴースト", ["はがね", "ゴースト", "かくとう"]],
  ["ドドゲザン", "あく", "はがね", ["あく", "はがね", "かくとう"]],
  ["ハバタクカミ", "ゴースト", "フェアリー", ["ゴースト", "フェアリー", "でんき"]],
  ["パオジアン", "あく", "こおり", ["あく", "こおり", "かくとう"]],
  ["ディンルー", "あく", "じめん", ["じめん", "あく", "いわ"]],
  ["イーユイ", "あく", "ほのお", ["ほのお", "あく", "エスパー"]],
  ["ミミッキュ", "ゴースト", "フェアリー", ["ゴースト", "フェアリー", "かくとう"]],
  ["マリルリ", "みず", "フェアリー", ["みず", "フェアリー", "かくとう"]],
  ["ギャラドス", "みず", "ひこう", ["みず", "ひこう", "あく", "じめん"]],
  ["ゲンガー", "ゴースト", "どく", ["ゴースト", "どく", "かくとう"]],
  ["ライチュウ", "でんき", "", ["でんき", "かくとう", "ノーマル"]],
  ["リザードン", "ほのお", "ひこう", ["ほのお", "ひこう", "ドラゴン"]],
  ["ハガネール", "はがね", "じめん", ["じめん", "はがね", "いわ"]],
  ["エルフーン", "くさ", "フェアリー", ["くさ", "フェアリー", "ひこう"]],
  ["アシレーヌ", "みず", "フェアリー", ["みず", "フェアリー", "こおり"]],
  ["ブリジュラス", "はがね", "ドラゴン", ["はがね", "ドラゴン", "でんき"]],
  ["ランドロス", "じめん", "ひこう", ["じめん", "ひこう", "いわ"]],
  ["ウーラオス", "かくとう", "みず", ["かくとう", "みず", "あく"]],
  ["水ウーラオス", "かくとう", "みず", ["かくとう", "みず", "あく"]],
  ["悪ウーラオス", "かくとう", "あく", ["かくとう", "あく", "どく"]],
  ["オーガポン", "くさ", "", ["くさ", "かくとう"]],
  ["オーガポン(炎)", "くさ", "ほのお", ["くさ", "ほのお", "かくとう"]],
  ["オーガポン(水)", "くさ", "みず", ["くさ", "みず", "かくとう"]],
  ["オーガポン(岩)", "くさ", "いわ", ["くさ", "いわ", "かくとう"]],
  ["キョジオーン", "いわ", "", ["いわ", "じめん"]],
  ["ヘイラッシャ", "みず", "", ["みず", "じめん", "こおり"]],
  ["ラウドボーン", "ほのお", "ゴースト", ["ほのお", "ゴースト", "フェアリー"]],
  ["ウォッシュロトム", "でんき", "みず", ["でんき", "みず", "あく"]],
  ["ヒートロトム", "でんき", "ほのお", ["でんき", "ほのお", "あく"]],
  ["カットロトム", "でんき", "くさ", ["でんき", "くさ", "あく"]],
  ["フロストロトム", "でんき", "こおり", ["でんき", "こおり", "あく"]],
  ["スピンロトム", "でんき", "ひこう", ["でんき", "ひこう", "あく"]],
  ["ドラパルト", "ドラゴン", "ゴースト", ["ドラゴン", "ゴースト", "ほのお"]],
  ["サザンドラ", "あく", "ドラゴン", ["あく", "ドラゴン", "ほのお"]],
  ["バンギラス", "いわ", "あく", ["いわ", "あく", "じめん"]],
  ["ドリュウズ", "じめん", "はがね", ["じめん", "はがね", "いわ"]],
  ["アーマーガア", "ひこう", "はがね", ["ひこう", "はがね", "かくとう"]],
  ["ブラッキー", "あく", "", ["あく", "どく"]],
  ["ニンフィア", "フェアリー", "", ["フェアリー", "エスパー"]],
  ["キラフロル", "いわ", "どく", ["いわ", "どく", "じめん"]],
  ["ウルガモス", "むし", "ほのお", ["むし", "ほのお", "くさ"]],
  ["ソウブレイズ", "ほのお", "ゴースト", ["ほのお", "ゴースト", "かくとう"]],
  ["マスカーニャ", "くさ", "あく", ["くさ", "あく", "かくとう"]],
  ["マンムー", "こおり", "じめん", ["こおり", "じめん", "いわ"]],
  ["ハッサム", "むし", "はがね", ["むし", "はがね", "かくとう"]],
  ["ルカリオ", "かくとう", "はがね", ["かくとう", "はがね", "あく"]],
  ["カビゴン", "ノーマル", "", ["ノーマル", "じめん", "かくとう"]],
  ["ピカチュウ", "でんき", "", ["でんき", "ノーマル", "かくとう"]]
];

const SAMPLE_MINE = [
  {name: "ライチュウ", type1: "でんき", type2: "", moves: ["でんき", "かくとう"]},
  {name: "ドドゲザン", type1: "あく", type2: "はがね", moves: ["あく", "はがね", "かくとう"]},
  {name: "ガブリアス", type1: "ドラゴン", type2: "じめん", moves: ["じめん", "ドラゴン", "いわ"]},
  {name: "マリルリ", type1: "みず", type2: "フェアリー", moves: ["みず", "フェアリー", "かくとう"]},
  {name: "ギャラドス", type1: "みず", type2: "ひこう", moves: ["みず", "ひこう", "じめん"]},
  {name: "ゲンガー", type1: "ゴースト", type2: "どく", moves: ["ゴースト", "どく", "かくとう"]}
];

const SAMPLE_OPPONENTS = [
  {name: "", type1: "ほのお", type2: "ひこう", moves: ["ほのお", "ひこう"]},
  {name: "", type1: "みず", type2: "フェアリー", moves: ["みず", "フェアリー"]},
  {name: "", type1: "はがね", type2: "じめん", moves: ["じめん", "はがね"]},
  {name: "", type1: "くさ", type2: "フェアリー", moves: ["くさ", "フェアリー"]},
  {name: "", type1: "ゴースト", type2: "どく", moves: ["ゴースト", "どく"]},
  {name: "", type1: "ドラゴン", type2: "ひこう", moves: ["ドラゴン", "ひこう"]}
];

const STORAGE_KEY = "pokemon-selection-assistant-parties";
const ownParty = document.querySelector("#ownParty");
const opponentParty = document.querySelector("#opponentParty");
const resultText = document.querySelector("#resultText");
const referenceLinks = document.querySelector("#referenceLinks");
const partyName = document.querySelector("#partyName");
const partySelect = document.querySelector("#partySelect");

async function fetchJson(path) {
  const response = await fetch(path, {cache: "no-store"});
  if (!response.ok) throw new Error(`${path}: ${response.status}`);
  return response.json();
}

function normalizePokemonDatabase(records) {
  return records.map((record) => [
    record.name,
    record.types?.[0] || "",
    record.types?.[1] || "",
    record.referenceMoveTypes || record.moves?.map((move) => move.type).filter(Boolean) || []
  ]);
}

async function loadDatabase() {
  try {
    const pokemonRecords = await fetchJson("data/pokemon.json");
    POKEMON_DB = normalizePokemonDatabase(pokemonRecords);
  } catch (error) {
    console.info("Using built-in fallback database.", error);
  }
}

function pokemonRecord(name) {
  const normalized = name.trim();
  return POKEMON_DB.find((item) => item[0] === normalized);
}

function optionsHtml() {
  return TYPES.map((type) => `<option value="${type}">${type}</option>`).join("");
}

function buildPartyInputs(container, prefix) {
  for (let index = 0; index < 6; index += 1) {
    const slot = document.createElement("div");
    slot.className = "pokemon-slot";
    slot.innerHTML = `
      <label for="${prefix}-name-${index}">${index + 1}体目</label>
      <input id="${prefix}-name-${index}" list="pokemonNameList" data-field="name" data-index="${index}" type="text" autocomplete="off" placeholder="名前">
      <div class="type-row">
        <select data-field="type1" data-index="${index}" aria-label="${index + 1}体目 タイプ1">${optionsHtml()}</select>
        <select data-field="type2" data-index="${index}" aria-label="${index + 1}体目 タイプ2">${optionsHtml()}</select>
      </div>
      <div class="move-preview" data-field="moves" data-index="${index}">参考技タイプ: 未設定</div>
      <div class="candidate-list" data-field="candidates" data-index="${index}"></div>
    `;
    container.appendChild(slot);
  }
}

function buildNameList() {
  const datalist = document.createElement("datalist");
  datalist.id = "pokemonNameList";
  POKEMON_DB.forEach(([name]) => {
    const option = document.createElement("option");
    option.value = name;
    datalist.appendChild(option);
  });
  document.body.appendChild(datalist);
}

function cleanType(value) {
  return value === "なし" ? "" : value;
}

function displayType(value) {
  return value || "なし";
}

function slotValue(container, field, index) {
  return container.querySelector(`[data-field="${field}"][data-index="${index}"]`).value;
}

function setSlotValue(container, field, index, value) {
  container.querySelector(`[data-field="${field}"][data-index="${index}"]`).value = value;
}

function readMoves(container, index) {
  const name = slotValue(container, "name", index).trim();
  const record = pokemonRecord(name);
  return record ? record[3] : [];
}

function fallbackMoves(pokemon) {
  if (pokemon.moves && pokemon.moves.length > 0) return pokemon.moves;
  return [pokemon.type1, pokemon.type2].filter(Boolean);
}

function readParty(container, {allowTypeOnly = false, opponentPrefix = "相手"} = {}) {
  const rows = [];
  for (let index = 0; index < 6; index += 1) {
    const name = slotValue(container, "name", index).trim();
    const type1 = cleanType(slotValue(container, "type1", index));
    const type2 = cleanType(slotValue(container, "type2", index));
    const moves = readMoves(container, index);
    const hasName = name.length > 0;
    const hasType = Boolean(type1 || type2);
    if (hasName || (allowTypeOnly && hasType)) {
      rows.push({name: name || `${opponentPrefix}${index + 1}体目`, type1, type2, moves});
    }
  }
  return rows;
}

function readAllSlots(container) {
  const rows = [];
  for (let index = 0; index < 6; index += 1) {
    rows.push({
      name: slotValue(container, "name", index).trim(),
      type1: cleanType(slotValue(container, "type1", index)),
      type2: cleanType(slotValue(container, "type2", index)),
      moves: readMoves(container, index)
    });
  }
  return rows;
}

function fillMoves(container, index, moves = []) {
  const box = container.querySelector(`[data-field="moves"][data-index="${index}"]`);
  const text = moves.length > 0 ? moves.join("/") : "未設定";
  box.textContent = `参考技タイプ: ${text}`;
}

function fillSlot(container, index, pokemon) {
  setSlotValue(container, "name", index, pokemon.name || "");
  setSlotValue(container, "type1", index, displayType(pokemon.type1));
  setSlotValue(container, "type2", index, displayType(pokemon.type2));
  fillMoves(container, index, pokemon.moves || []);
  updateCandidates(container, index);
}

function fillParty(container, data) {
  clearParty(container);
  data.slice(0, 6).forEach((pokemon, index) => {
    const item = Array.isArray(pokemon)
      ? {name: pokemon[0], type1: cleanType(pokemon[1]), type2: cleanType(pokemon[2]), moves: pokemon[3] || []}
      : pokemon;
    fillSlot(container, index, item);
  });
}

function clearParty(container) {
  container.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  container.querySelectorAll("select").forEach((select) => {
    select.value = "なし";
  });
  container.querySelectorAll(".move-preview").forEach((box) => {
    box.textContent = "参考技タイプ: 未設定";
  });
  container.querySelectorAll(".candidate-list").forEach((box) => {
    box.textContent = "";
  });
}

function applyPokemonRecord(container, index, record) {
  const [name, type1, type2, moves] = record;
  fillSlot(container, index, {name, type1, type2, moves});
}

function updateCandidates(container, index) {
  const box = container.querySelector(`[data-field="candidates"][data-index="${index}"]`);
  const type1 = cleanType(slotValue(container, "type1", index));
  const type2 = cleanType(slotValue(container, "type2", index));
  const selectedTypes = [type1, type2].filter(Boolean);
  box.innerHTML = "";
  if (selectedTypes.length === 0) return;

  const candidates = POKEMON_DB
    .filter(([, dbType1, dbType2]) => selectedTypes.every((type) => [dbType1, dbType2].includes(type)))
    .slice(0, 8);

  if (candidates.length === 0) {
    box.textContent = "候補なし";
    return;
  }

  candidates.forEach((record) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = record[0];
    button.addEventListener("click", () => applyPokemonRecord(container, index, record));
    box.appendChild(button);
  });
}

function wireAutoFill(container) {
  container.addEventListener("change", (event) => {
    const target = event.target;
    const index = Number(target.dataset.index);
    if (!Number.isInteger(index)) return;

    if (target.dataset.field === "type1" || target.dataset.field === "type2") {
      updateCandidates(container, index);
      const name = slotValue(container, "name", index).trim();
      const record = pokemonRecord(name);
      fillMoves(container, index, record ? record[3] : []);
    }
  });

  container.addEventListener("input", (event) => {
    const target = event.target;
    if (target.dataset.field !== "name") return;
    const index = Number(target.dataset.index);
    const record = pokemonRecord(target.value);
    if (record) applyPokemonRecord(container, index, record);
  });
}

function typeText(pokemon) {
  return [pokemon.type1, pokemon.type2].filter(Boolean).join("/") || "タイプ未設定";
}

function moveText(pokemon) {
  return fallbackMoves(pokemon).join("/") || "技タイプ未設定";
}

function multiplier(attackType, defendTypes) {
  if (!attackType) return 1;
  return defendTypes.reduce((value, defendType) => {
    if (!defendType) return value;
    return value * (TYPE_CHART[attackType]?.[defendType] ?? 1);
  }, 1);
}

function moveImpact(attacker, defender, moveType) {
  const stab = [attacker.type1, attacker.type2].includes(moveType) ? 1.5 : 1;
  return multiplier(moveType, [defender.type1, defender.type2]) * stab;
}

function bestMoveImpact(attacker, defender) {
  const moves = fallbackMoves(attacker);
  if (moves.length === 0) return 1;
  return Math.max(...moves.map((moveType) => moveImpact(attacker, defender, moveType)));
}

function bestRawMoveMultiplier(attacker, defender) {
  const moves = fallbackMoves(attacker);
  if (moves.length === 0) return 1;
  return Math.max(...moves.map((moveType) => multiplier(moveType, [defender.type1, defender.type2])));
}

function coverageBonus(attacker, opponents) {
  const moves = fallbackMoves(attacker);
  const distinctMoves = new Set(moves).size;
  const superEffectiveCount = opponents.filter((opponent) => bestRawMoveMultiplier(attacker, opponent) >= 2).length;
  return (distinctMoves * 8) + (superEffectiveCount * 12);
}

function matchupScore(own, opponent) {
  const attack = bestMoveImpact(own, opponent);
  const damageTaken = bestMoveImpact(opponent, own);
  return (attack * 30) - (damageTaken * 24);
}

function totalScore(own, opponents) {
  const attackTotal = opponents.reduce((sum, opponent) => sum + bestMoveImpact(own, opponent), 0);
  const damageTotal = opponents.reduce((sum, opponent) => sum + bestMoveImpact(opponent, own), 0);
  const bonus = coverageBonus(own, opponents);
  return {
    score: (attackTotal * 100) - (damageTotal * 80) + bonus,
    attackTotal,
    damageTotal,
    bonus
  };
}

function matchupLabel(score) {
  if (score >= 36) return "かなり有利";
  if (score >= 16) return "有利";
  if (score >= -6) return "五分";
  if (score >= -24) return "不利";
  return "かなり不利";
}

function assignmentForSelection(selection, opponents) {
  return opponents.map((opponent) => {
    const own = selection.reduce((best, current) => (
      matchupScore(current, opponent) > matchupScore(best, opponent) ? current : best
    ), selection[0]);
    return {opponent, own};
  });
}

function loadParties() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveParties(parties) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(parties));
}

function refreshPartySelect() {
  const parties = loadParties();
  const current = partySelect.value;
  partySelect.innerHTML = "";
  Object.keys(parties).sort().forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    partySelect.appendChild(option);
  });
  if (parties[current]) partySelect.value = current;
}

function showMessage(message) {
  resultText.textContent = message;
  renderReferenceLinks([]);
}

function compactPartyForShare(container) {
  return readAllSlots(container)
    .map((pokemon) => ({
      n: pokemon.name,
      t: [pokemon.type1, pokemon.type2].filter(Boolean)
    }))
    .filter((pokemon) => pokemon.n || pokemon.t.length > 0);
}

function expandSharedParty(items = []) {
  return items.slice(0, 6).map((item) => ({
    name: item.n || "",
    type1: item.t?.[0] || "",
    type2: item.t?.[1] || "",
    moves: []
  }));
}

function encodeShareState() {
  const data = {
    v: 1,
    own: compactPartyForShare(ownParty),
    opp: compactPartyForShare(opponentParty)
  };
  const json = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeShareState(hash) {
  const raw = hash.startsWith("#share=") ? hash.slice(7) : "";
  if (!raw) return null;
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const data = JSON.parse(json);
    return data?.v === 1 ? data : null;
  } catch {
    return null;
  }
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

async function handleShareUrl() {
  const encoded = encodeShareState();
  const url = `${location.origin}${location.pathname}#share=${encoded}`;
  history.replaceState(null, "", `#share=${encoded}`);
  const copied = await copyText(url);
  showMessage(copied
    ? `共有URLを作成してコピーしました。\n${url}`
    : `共有URLを作成しました。コピーして共有してください。\n${url}`);
}

function loadFromShareHash() {
  const data = decodeShareState(location.hash);
  if (!data) return false;
  fillParty(ownParty, expandSharedParty(data.own));
  fillParty(opponentParty, expandSharedParty(data.opp));
  showMessage("共有URLからパーティを読み込みました。必要に応じて「選出する」を押してください。");
  return true;
}

function renderReferenceLinks() {
  referenceLinks.innerHTML = "";
}

function handleSaveParty() {
  const name = partyName.value.trim();
  if (!name) {
    alert("登録名を入力してください。");
    return;
  }

  const party = readAllSlots(ownParty);
  if (!party.some((pokemon) => pokemon.name)) {
    alert("自身のパーティを1体以上入力してください。");
    return;
  }

  const parties = loadParties();
  parties[name] = party;
  saveParties(parties);
  refreshPartySelect();
  partySelect.value = name;
  showMessage(`「${name}」を登録しました。`);
}

function handleLoadParty() {
  const name = partySelect.value;
  const parties = loadParties();
  if (!name || !parties[name]) {
    alert("読み込む登録パーティを選択してください。");
    return;
  }
  fillParty(ownParty, parties[name]);
  partyName.value = name;
  showMessage(`「${name}」を読み込みました。`);
}

function handleDeleteParty() {
  const name = partySelect.value;
  const parties = loadParties();
  if (!name || !parties[name]) {
    alert("削除する登録パーティを選択してください。");
    return;
  }
  if (!confirm(`「${name}」を削除しますか？`)) return;
  delete parties[name];
  saveParties(parties);
  refreshPartySelect();
  showMessage(`「${name}」を削除しました。`);
}

function recommend() {
  const mine = readParty(ownParty);
  const opponents = readParty(opponentParty, {allowTypeOnly: true});

  if (mine.length < 3) {
    alert("自身のポケモンを3体以上入力してください。");
    return;
  }
  if (opponents.length < 1) {
    alert("相手のポケモンは名前なしでもよいので、タイプを1体以上入力してください。");
    return;
  }

  const ranked = mine
    .map((pokemon) => ({pokemon, ...totalScore(pokemon, opponents)}))
    .sort((a, b) => b.score - a.score);
  const selection = ranked.slice(0, 3).map((item) => item.pokemon);
  const assignments = assignmentForSelection(selection, opponents);

  const lines = [];
  lines.push("【選出すべき3体】");
  lines.push(selection.map((pokemon) => `${pokemon.name}（${typeText(pokemon)} / 技:${moveText(pokemon)}）`).join(" / "));
  lines.push("");
  lines.push("【総合スコア】");
  ranked.forEach((item, index) => {
    const selected = selection.includes(item.pokemon) ? " 選出" : "";
    lines.push(`${index + 1}. ${item.pokemon.name}（${typeText(item.pokemon)}）: 総合 ${item.score.toFixed(1)} / 攻撃評価 ${item.attackTotal.toFixed(2)} / 被ダメージ評価 ${item.damageTotal.toFixed(2)} / 技範囲補正 ${item.bonus.toFixed(1)}${selected}`);
    lines.push(`   技タイプ: ${moveText(item.pokemon)}`);
  });
  lines.push("");
  lines.push("【誰を誰に対面させるか】");
  assignments.forEach(({opponent, own}) => {
    const score = matchupScore(own, opponent);
    const attack = bestRawMoveMultiplier(own, opponent);
    const taken = bestRawMoveMultiplier(opponent, own);
    lines.push(`${opponent.name}（${typeText(opponent)} / 技:${moveText(opponent)}）には ${own.name}（${typeText(own)}）: ${matchupLabel(score)} / 最高攻撃倍率 x${attack}・最高被弾倍率 x${taken}`);
  });
  lines.push("");
  lines.push("【選出内の担当数】");
  selection.forEach((own) => {
    const targets = assignments.filter((item) => item.own === own).map((item) => item.opponent.name);
    lines.push(`${own.name}: ${targets.length ? targets.join("、") : "明確な担当なし"}`);
  });
  lines.push("");
  lines.push("");
  lines.push("【相性表】");
  lines.push(["相手", ...mine.map((pokemon) => pokemon.name)].join(" | "));
  lines.push("-".repeat(80));
  opponents.forEach((opponent) => {
    lines.push([opponent.name, ...mine.map((own) => matchupLabel(matchupScore(own, opponent)))].join(" | "));
  });
  lines.push("※技範囲は内蔵の参考技タイプを使います。参考技タイプが未設定の場合は、そのポケモン自身のタイプ一致技を持つものとして判定します。");
  lines.push("※威力、命中、特性、持ち物、テラスタル、素早さ関係は最終判断で補ってください。");
  resultText.textContent = lines.join("\n");
  renderReferenceLinks();
}

async function initialize() {
  await loadDatabase();
  buildNameList();
  buildPartyInputs(ownParty, "own");
  buildPartyInputs(opponentParty, "opponent");
  wireAutoFill(ownParty);
  wireAutoFill(opponentParty);
  renderReferenceLinks([]);
  refreshPartySelect();

  document.querySelector("#saveParty").addEventListener("click", handleSaveParty);
  document.querySelector("#loadParty").addEventListener("click", handleLoadParty);
  document.querySelector("#deleteParty").addEventListener("click", handleDeleteParty);
  document.querySelector("#shareButton").addEventListener("click", handleShareUrl);
  document.querySelector("#sampleButton").addEventListener("click", () => {
    fillParty(ownParty, SAMPLE_MINE);
    fillParty(opponentParty, SAMPLE_OPPONENTS);
    recommend();
  });
  document.querySelector("#clearButton").addEventListener("click", () => {
    clearParty(ownParty);
    clearParty(opponentParty);
    showMessage("入力をクリアしました。");
  });
  document.querySelector("#recommendButton").addEventListener("click", recommend);
  loadFromShareHash();
  window.addEventListener("hashchange", loadFromShareHash);
}

initialize();

