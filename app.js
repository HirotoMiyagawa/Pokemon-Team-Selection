"use strict";

const TYPES = [
  "なし", "ノーマル", "ほのお", "みず", "でんき", "くさ", "こおり", "かくとう", "どく",
  "じめん", "ひこう", "エスパー", "むし", "いわ", "ゴースト", "ドラゴン",
  "あく", "はがね", "フェアリー"
];

const TYPE_CHART = {
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

const SAMPLE_MINE = [
  ["ライチュウ", "でんき", "なし"],
  ["ドドゲザン", "あく", "はがね"],
  ["ガブリアス", "ドラゴン", "じめん"],
  ["マリルリ", "みず", "フェアリー"],
  ["ギャラドス", "みず", "ひこう"],
  ["ゲンガー", "ゴースト", "どく"]
];

const SAMPLE_OPPONENTS = [
  ["", "ほのお", "ひこう"],
  ["", "みず", "フェアリー"],
  ["", "はがね", "じめん"],
  ["", "くさ", "フェアリー"],
  ["", "ゴースト", "どく"],
  ["", "ドラゴン", "ひこう"]
];

const STORAGE_KEY = "pokemon-selection-assistant-parties";

const ownParty = document.querySelector("#ownParty");
const opponentParty = document.querySelector("#opponentParty");
const resultText = document.querySelector("#resultText");
const partyName = document.querySelector("#partyName");
const partySelect = document.querySelector("#partySelect");

function buildPartyInputs(container, prefix) {
  for (let index = 0; index < 6; index += 1) {
    const slot = document.createElement("div");
    slot.className = "pokemon-slot";
    slot.innerHTML = `
      <label for="${prefix}-name-${index}">${index + 1}体目</label>
      <input id="${prefix}-name-${index}" data-field="name" data-index="${index}" type="text" autocomplete="off">
      <div class="type-row">
        <select data-field="type1" data-index="${index}" aria-label="${index + 1}体目 タイプ1"></select>
        <select data-field="type2" data-index="${index}" aria-label="${index + 1}体目 タイプ2"></select>
      </div>
    `;
    container.appendChild(slot);
  }

  container.querySelectorAll("select").forEach((select) => {
    TYPES.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      select.appendChild(option);
    });
  });
}

function cleanType(value) {
  return value === "なし" ? "" : value;
}

function displayType(value) {
  return value || "なし";
}

function readParty(container, {allowTypeOnly = false, opponentPrefix = "相手"} = {}) {
  const rows = [];
  for (let index = 0; index < 6; index += 1) {
    const name = container.querySelector(`[data-field="name"][data-index="${index}"]`).value.trim();
    const type1 = cleanType(container.querySelector(`[data-field="type1"][data-index="${index}"]`).value);
    const type2 = cleanType(container.querySelector(`[data-field="type2"][data-index="${index}"]`).value);
    const hasName = name.length > 0;
    const hasType = Boolean(type1 || type2);
    if (hasName || (allowTypeOnly && hasType)) {
      rows.push({name: name || `${opponentPrefix}${index + 1}体目`, type1, type2});
    }
  }
  return rows;
}

function readAllSlots(container) {
  const rows = [];
  for (let index = 0; index < 6; index += 1) {
    rows.push({
      name: container.querySelector(`[data-field="name"][data-index="${index}"]`).value.trim(),
      type1: cleanType(container.querySelector(`[data-field="type1"][data-index="${index}"]`).value),
      type2: cleanType(container.querySelector(`[data-field="type2"][data-index="${index}"]`).value)
    });
  }
  return rows;
}

function fillParty(container, data) {
  clearParty(container);
  data.slice(0, 6).forEach((pokemon, index) => {
    const item = Array.isArray(pokemon)
      ? {name: pokemon[0], type1: cleanType(pokemon[1]), type2: cleanType(pokemon[2])}
      : pokemon;
    container.querySelector(`[data-field="name"][data-index="${index}"]`).value = item.name || "";
    container.querySelector(`[data-field="type1"][data-index="${index}"]`).value = displayType(item.type1);
    container.querySelector(`[data-field="type2"][data-index="${index}"]`).value = displayType(item.type2);
  });
}

function clearParty(container) {
  container.querySelectorAll("input").forEach((input) => {
    input.value = "";
  });
  container.querySelectorAll("select").forEach((select) => {
    select.value = "なし";
  });
}

function typeText(pokemon) {
  return [pokemon.type1, pokemon.type2].filter(Boolean).join("/") || "タイプ未設定";
}

function multiplier(attackType, defendTypes) {
  if (!attackType) return 1;
  return defendTypes.reduce((value, defendType) => {
    if (!defendType) return value;
    return value * (TYPE_CHART[attackType]?.[defendType] ?? 1);
  }, 1);
}

function bestAttackMultiplier(attacker, defender) {
  const attackTypes = [attacker.type1, attacker.type2].filter(Boolean);
  if (attackTypes.length === 0) return 1;
  return Math.max(...attackTypes.map((type) => multiplier(type, [defender.type1, defender.type2])));
}

function matchupScore(own, opponent) {
  const attack = bestAttackMultiplier(own, opponent);
  const damageTaken = bestAttackMultiplier(opponent, own);
  return (attack * 30) - (damageTaken * 24);
}

function totalScore(own, opponents) {
  const attackTotal = opponents.reduce((sum, opponent) => sum + bestAttackMultiplier(own, opponent), 0);
  const damageTotal = opponents.reduce((sum, opponent) => sum + bestAttackMultiplier(opponent, own), 0);
  return {
    score: (attackTotal * 100) - (damageTotal * 80),
    attackTotal,
    damageTotal
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
  if (parties[current]) {
    partySelect.value = current;
  }
}

function showMessage(message) {
  resultText.textContent = message;
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
  lines.push(selection.map((pokemon) => `${pokemon.name}（${typeText(pokemon)}）`).join(" / "));
  lines.push("");
  lines.push("【総合スコア】");
  ranked.forEach((item, index) => {
    const selected = selection.includes(item.pokemon) ? " 選出" : "";
    lines.push(`${index + 1}. ${item.pokemon.name}（${typeText(item.pokemon)}）: 総合 ${item.score.toFixed(1)} / 攻撃倍率合計 ${item.attackTotal.toFixed(2)} / 被ダメージ倍率合計 ${item.damageTotal.toFixed(2)}${selected}`);
  });
  lines.push("");
  lines.push("【誰を誰に対面させるか】");
  assignments.forEach(({opponent, own}) => {
    const score = matchupScore(own, opponent);
    const attack = bestAttackMultiplier(own, opponent);
    const taken = bestAttackMultiplier(opponent, own);
    lines.push(`${opponent.name}（${typeText(opponent)}）には ${own.name}（${typeText(own)}）: ${matchupLabel(score)} / 攻撃相性 x${attack}・被弾相性 x${taken}`);
  });
  lines.push("");
  lines.push("【選出内の担当数】");
  selection.forEach((own) => {
    const targets = assignments.filter((item) => item.own === own).map((item) => item.opponent.name);
    lines.push(`${own.name}: ${targets.length ? targets.join("、") : "明確な担当なし"}`);
  });
  lines.push("");
  lines.push("【相性表】");
  lines.push(["相手", ...mine.map((pokemon) => pokemon.name)].join(" | "));
  lines.push("-".repeat(80));
  opponents.forEach((opponent) => {
    lines.push([opponent.name, ...mine.map((own) => matchupLabel(matchupScore(own, opponent)))].join(" | "));
  });
  lines.push("");
  lines.push("※タイプ相性のみで判定しています。技範囲、特性、持ち物、テラスタル、素早さ関係は最終判断で補ってください。");
  resultText.textContent = lines.join("\n");
}

function initialize() {
  buildPartyInputs(ownParty, "own");
  buildPartyInputs(opponentParty, "opponent");
  refreshPartySelect();

  document.querySelector("#saveParty").addEventListener("click", handleSaveParty);
  document.querySelector("#loadParty").addEventListener("click", handleLoadParty);
  document.querySelector("#deleteParty").addEventListener("click", handleDeleteParty);
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
}

initialize();
