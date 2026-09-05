const board = document.querySelector("#board");
const gameList = document.querySelector("#gameList");
const gameTitle = document.querySelector("#gameTitle");
const gameTag = document.querySelector("#gameTag");
const gameGoal = document.querySelector("#gameGoal");
const message = document.querySelector("#message");
const scoreEl = document.querySelector("#score");
const timerEl = document.querySelector("#timer");
const levelEl = document.querySelector("#level");
const resetBtn = document.querySelector("#resetBtn");
const actionBtn = document.querySelector("#actionBtn");

const games = [
  {
    id: "crate",
    tag: "Sokoban micro",
    title: "ลังหนีประตู",
    idea: "ดันลังลงแท่น แล้วเดินเข้าประตูให้ทัน 60 วินาที",
    goal: "ดันลังสีน้ำตาลไปทับช่องขอบทอง จากนั้นพาตัวผู้เล่นไปที่ประตูสีเขียว",
    size: 7,
    map: [
      "#######",
      "#P..#E#",
      "#.#...#",
      "#..C..#",
      "#..G..#",
      "#.....#",
      "#######",
    ],
  },
  {
    id: "circuit",
    tag: "Circuit flip",
    title: "ต่อไฟ 5 จุด",
    idea: "กดสวิตช์ให้ node ไฟติดครบก่อนหมดเวลา",
    goal: "เดินไปเหยียบ node แล้วกด Action เพื่อสลับไฟ จุดติดครบทุกจุดคือชนะ",
    size: 6,
    map: [
      "######",
      "#P.N.#",
      "#.##.#",
      "#N..N#",
      "#..N.#",
      "######",
    ],
  },
  {
    id: "locks",
    tag: "Key route",
    title: "กุญแจสามสี",
    idea: "เก็บกุญแจให้ครบเพื่อเปิดทางออก",
    goal: "เดินเก็บกุญแจ K ทั้งสามดอก แล้วไปช่องประตูเขียว",
    size: 7,
    map: [
      "#######",
      "#P.K..#",
      "#.###.#",
      "#K..#E#",
      "#.#...#",
      "#..K..#",
      "#######",
    ],
  },
  {
    id: "bridge",
    tag: "Color bridge",
    title: "สะพานสลับสี",
    idea: "เปลี่ยนสะพานให้เดินผ่านน้ำได้ใน route สั้นที่สุด",
    goal: "กด Action เพื่อสลับสะพานน้ำเงิน/แดง เดินบนช่องที่เปิดอยู่แล้วไปถึงทางออก",
    size: 7,
    map: [
      "#######",
      "#P.B.E#",
      "#.###.#",
      "#R...B#",
      "#.###.#",
      "#B...R#",
      "#######",
    ],
  },
  {
    id: "memory",
    tag: "Memory glyph",
    title: "จำลำดับรูน",
    idea: "ดูสัญลักษณ์ 4 ช่อง แล้วกดเรียงตามลำดับ",
    goal: "กด Action บนรูนตามลำดับ 1-2-3-4 ถ้ากดผิดจะรีเซ็ตลำดับ",
    size: 6,
    map: [
      "######",
      "#P.1.#",
      "#.##.#",
      "#3..2#",
      "#..4E#",
      "######",
    ],
  },
];

let activeIndex = 0;
let state;
let score = 0;
let level = 1;
let timeLeft = 60;
let timerId;
let nextStageId;

const harderStages = {
  crate: [
    {
      size: 7,
      map: [
        "#######",
        "#P..#E#",
        "#.#...#",
        "#..C..#",
        "#..G..#",
        "#.....#",
        "#######",
      ],
    },
    {
      size: 8,
      map: [
        "########",
        "#P..#..#",
        "#.#.#E.#",
        "#..C...#",
        "###.#..#",
        "#...G..#",
        "#......#",
        "########",
      ],
    },
    {
      size: 9,
      map: [
        "#########",
        "#P.....E#",
        "#.#...#.#",
        "#...C...#",
        "#.#...#.#",
        "#...G...#",
        "#.#...#.#",
        "#.......#",
        "#########",
      ],
    },
  ],
  circuit: [
    {
      size: 6,
      map: [
        "######",
        "#P.N.#",
        "#.##.#",
        "#N..N#",
        "#..N.#",
        "######",
      ],
    },
    {
      size: 7,
      map: [
        "#######",
        "#P.N..#",
        "#.###.#",
        "#N...N#",
        "#.###.#",
        "#N..N.#",
        "#######",
      ],
    },
    {
      size: 8,
      map: [
        "########",
        "#P.N...#",
        "#.###N.#",
        "#N.....#",
        "###.####",
        "#N..N..#",
        "#...N..#",
        "########",
      ],
    },
  ],
  locks: [
    {
      size: 7,
      map: [
        "#######",
        "#P.K..#",
        "#.###.#",
        "#K..#E#",
        "#.#...#",
        "#..K..#",
        "#######",
      ],
    },
    {
      size: 8,
      map: [
        "########",
        "#P.K...#",
        "#.####.#",
        "#K...#E#",
        "###.#..#",
        "#..K#K.#",
        "#......#",
        "########",
      ],
    },
    {
      size: 9,
      map: [
        "#########",
        "#P.K....#",
        "#.#####.#",
        "#K....#E#",
        "###.#.#.#",
        "#..K#...#",
        "#.###K#.#",
        "#....K..#",
        "#########",
      ],
    },
  ],
  bridge: [
    {
      size: 7,
      map: [
        "#######",
        "#P.B.E#",
        "#.###.#",
        "#R...B#",
        "#.###.#",
        "#B...R#",
        "#######",
      ],
    },
    {
      size: 8,
      map: [
        "########",
        "#P.B..E#",
        "#.####.#",
        "#R...B.#",
        "#.##.#.#",
        "#B..R..#",
        "#..B.R.#",
        "########",
      ],
    },
    {
      size: 9,
      map: [
        "#########",
        "#P.B...E#",
        "#.#####.#",
        "#R...B..#",
        "###.#.###",
        "#B..R..B#",
        "#.###.#.#",
        "#..B.R..#",
        "#########",
      ],
    },
  ],
  memory: [
    {
      size: 6,
      map: [
        "######",
        "#P.1.#",
        "#.##.#",
        "#3..2#",
        "#..4E#",
        "######",
      ],
    },
    {
      size: 7,
      map: [
        "#######",
        "#P..1.#",
        "#.###.#",
        "#3...2#",
        "#.###.#",
        "#..4.E#",
        "#######",
      ],
    },
    {
      size: 8,
      map: [
        "########",
        "#P...1.#",
        "#.####.#",
        "#3.....#",
        "###.##.#",
        "#..4..2#",
        "#.....E#",
        "########",
      ],
    },
  ],
};

function startGame(index = activeIndex) {
  activeIndex = index;
  const game = games[activeIndex];
  const stage = getStage(game);
  state = parseMap(stage);
  timeLeft = getStageTime();
  message.textContent = "ใช้ WASD/ลูกศร หรือปุ่มด้านล่าง กด Space/Action เพื่อโต้ตอบ";
  gameTitle.textContent = `${game.title} - ด่าน ${level}`;
  gameTag.textContent = `${game.tag} / แบบ ${getStageNumber()}`;
  gameGoal.textContent = `${game.goal} เวลาเริ่มต้นด่านนี้ ${timeLeft} วินาที`;
  renderGameList();
  render();
  restartTimer();
  board.focus();
}

function parseMap(game) {
  const data = {
    size: game.size,
    walls: new Set(),
    goals: new Set(),
    crates: new Set(),
    nodes: new Map(),
    keys: new Set(),
    bridges: new Map(),
    runes: new Map(),
    player: { x: 0, y: 0 },
    exit: null,
    bridgeBlue: true,
    keysGot: 0,
    totalKeys: 0,
    memoryNext: 1,
    won: false,
  };

  game.map.forEach((row, y) => {
    [...row].forEach((char, x) => {
      const key = posKey(x, y);
      if (char === "#") data.walls.add(key);
      if (char === "P") data.player = { x, y };
      if (char === "E") data.exit = { x, y };
      if (char === "C") data.crates.add(key);
      if (char === "G") data.goals.add(key);
      if (char === "N") data.nodes.set(key, false);
      if (char === "K") {
        data.keys.add(key);
        data.totalKeys += 1;
      }
      if (char === "B") data.bridges.set(key, "blue");
      if (char === "R") data.bridges.set(key, "red");
      if ("1234".includes(char)) data.runes.set(key, Number(char));
    });
  });
  return data;
}

function renderGameList() {
  gameList.innerHTML = "";
  games.forEach((game, index) => {
    const button = document.createElement("button");
    button.className = `game-card${index === activeIndex ? " active" : ""}`;
    button.innerHTML = `<strong>${game.title}</strong><p>${game.idea}</p>`;
    button.addEventListener("click", () => {
      clearTimeout(nextStageId);
      activeIndex = index;
      level = 1;
      score = 0;
      startGame(index);
    });
    gameList.append(button);
  });
}

function render() {
  board.style.setProperty("--size", state.size);
  board.innerHTML = "";
  for (let y = 0; y < state.size; y += 1) {
    for (let x = 0; x < state.size; x += 1) {
      const key = posKey(x, y);
      const cell = document.createElement("div");
      cell.className = "cell";
      if (state.walls.has(key)) cell.classList.add("wall");
      if (state.goals.has(key)) cell.classList.add("goal-tile");
      if (state.exit && state.exit.x === x && state.exit.y === y) cell.classList.add("exit");
      if (state.bridges.has(key)) {
        const color = state.bridges.get(key);
        const open = (color === "blue" && state.bridgeBlue) || (color === "red" && !state.bridgeBlue);
        cell.classList.add(open ? "wire-on" : "water");
        cell.textContent = color === "blue" ? "B" : "R";
      }
      if (state.nodes.has(key)) {
        cell.classList.add(state.nodes.get(key) ? "wire-on" : "wire-off", "node");
        cell.dataset.icon = state.nodes.get(key) ? "●" : "○";
      }
      if (state.keys.has(key)) {
        cell.classList.add("key");
        cell.dataset.icon = "K";
      }
      if (state.runes.has(key)) {
        cell.classList.add("symbol");
        cell.dataset.icon = state.runes.get(key);
      }
      if (state.crates.has(key)) {
        cell.classList.add("crate");
        cell.dataset.icon = "□";
      }
      if (state.player.x === x && state.player.y === y) {
        cell.classList.add("player");
        cell.textContent = "@";
      }
      board.append(cell);
    }
  }
  scoreEl.textContent = String(score);
  levelEl.textContent = String(level);
}

function move(dx, dy) {
  if (state.won || timeLeft <= 0) return;
  const nx = state.player.x + dx;
  const ny = state.player.y + dy;
  const next = posKey(nx, ny);
  if (blocked(nx, ny)) return;

  if (state.crates.has(next)) {
    const cx = nx + dx;
    const cy = ny + dy;
    const crateNext = posKey(cx, cy);
    if (blocked(cx, cy) || state.crates.has(crateNext)) return;
    state.crates.delete(next);
    state.crates.add(crateNext);
  }

  state.player = { x: nx, y: ny };
  const playerKey = posKey(nx, ny);
  if (state.keys.delete(playerKey)) {
    state.keysGot += 1;
    message.textContent = `เก็บกุญแจแล้ว ${state.keysGot}/${state.totalKeys}`;
  }
  checkWin();
  render();
}

function action() {
  if (state.won || timeLeft <= 0) return;
  const key = posKey(state.player.x, state.player.y);
  const game = games[activeIndex];
  if (game.id === "circuit" && state.nodes.has(key)) {
    state.nodes.set(key, !state.nodes.get(key));
    message.textContent = "สลับไฟแล้ว";
  } else if (game.id === "bridge") {
    state.bridgeBlue = !state.bridgeBlue;
    message.textContent = state.bridgeBlue ? "สะพานน้ำเงินเปิด" : "สะพานแดงเปิด";
  } else if (game.id === "memory" && state.runes.has(key)) {
    const value = state.runes.get(key);
    if (value === state.memoryNext) {
      state.memoryNext += 1;
      message.textContent = value === 4 ? "ลำดับครบแล้ว ไปที่ประตู" : `ถูกต้อง ต่อไป ${state.memoryNext}`;
    } else {
      state.memoryNext = 1;
      message.textContent = "ผิดลำดับ เริ่มที่ 1 ใหม่";
    }
  } else {
    message.textContent = "ช่องนี้ไม่มีอะไรให้กด";
  }
  checkWin();
  render();
}

function blocked(x, y) {
  const key = posKey(x, y);
  if (x < 0 || y < 0 || x >= state.size || y >= state.size) return true;
  if (state.walls.has(key)) return true;
  if (state.bridges.has(key)) {
    const color = state.bridges.get(key);
    return (color === "blue" && !state.bridgeBlue) || (color === "red" && state.bridgeBlue);
  }
  return false;
}

function checkWin() {
  const game = games[activeIndex];
  const atExit = state.exit && state.player.x === state.exit.x && state.player.y === state.exit.y;
  let won = false;
  if (game.id === "crate") {
    won = [...state.goals].every((goal) => state.crates.has(goal)) && atExit;
  } else if (game.id === "circuit") {
    won = [...state.nodes.values()].every(Boolean);
  } else if (game.id === "locks") {
    won = state.keys.size === 0 && atExit;
  } else if (game.id === "bridge") {
    won = atExit;
  } else if (game.id === "memory") {
    won = state.memoryNext === 5 && atExit;
  }

  if (won) {
    state.won = true;
    const bonus = Math.max(10, Math.round(timeLeft) + level * 5);
    score += bonus;
    message.textContent = `ผ่านด่าน! +${bonus} คะแนน กำลังไปด่าน ${level + 1}`;
    clearInterval(timerId);
    nextStageId = setTimeout(nextStage, 1100);
  }
}

function nextStage() {
  level += 1;
  startGame(activeIndex);
}

function getStage(game) {
  const variants = harderStages[game.id] || [game];
  return variants[Math.min(level - 1, variants.length - 1)];
}

function getStageNumber() {
  const variants = harderStages[games[activeIndex].id] || [games[activeIndex]];
  return Math.min(level, variants.length);
}

function getStageTime() {
  return Math.max(30, 60 - (level - 1) * 5);
}

function restartTimer() {
  clearInterval(timerId);
  timerEl.textContent = timeLeft.toFixed(1);
  timerId = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 0.1);
    timerEl.textContent = timeLeft.toFixed(1);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      message.textContent = "หมดเวลา กดเริ่มใหม่หรือลองด่านอื่น";
    }
  }, 100);
}

function posKey(x, y) {
  return `${x},${y}`;
}

document.addEventListener("keydown", (event) => {
  const keyMap = {
    ArrowUp: [0, -1],
    w: [0, -1],
    W: [0, -1],
    ArrowDown: [0, 1],
    s: [0, 1],
    S: [0, 1],
    ArrowLeft: [-1, 0],
    a: [-1, 0],
    A: [-1, 0],
    ArrowRight: [1, 0],
    d: [1, 0],
    D: [1, 0],
  };
  if (keyMap[event.key]) {
    event.preventDefault();
    move(...keyMap[event.key]);
  }
  if (event.key === " " || event.key === "Enter") {
    event.preventDefault();
    action();
  }
});

document.querySelectorAll("[data-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    const dirs = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };
    move(...dirs[button.dataset.dir]);
  });
});

resetBtn.addEventListener("click", () => {
  clearTimeout(nextStageId);
  startGame(activeIndex);
});
actionBtn.addEventListener("click", action);

startGame(0);
