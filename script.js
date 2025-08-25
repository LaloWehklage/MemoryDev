const concepts = [
  ["HTML", "Linguagem de marcação"],
  ["CSS", "Estilização"],
  ["JavaScript", "Lógica do navegador"],
  ["Git", "Controle de versão"],
  ["API", "Interface de comunicação"],
  ["React", "Framework front-end"],
  ["Banco de Dados", "Armazenamento de dados"],
  ["Docker", "Contêinerização"],
  ["Scrum", "Gestão ágil"],
  ["REST", "Arquitetura de APIs"]
];

let level = 1;
const maxLevel = concepts.length;
let flippedCards = [];
let matchedPairs = 0;
let startTime;
let timerInterval;
let phaseTimes = [];

const levelElement = document.getElementById("level");
const gameBoard = document.getElementById("gameBoard");
const messageElement = document.getElementById("message");
const timerDisplay = document.getElementById("timer");
const phaseTimesDisplay = document.getElementById("phaseTimes");

function setupLevel(level) {
  messageElement.textContent = "";
  flippedCards = [];
  matchedPairs = 0;
  levelElement.textContent = level;
  gameBoard.innerHTML = "";
  timerDisplay.textContent = "⏱️ Tempo: 0s";

  const pairsCount = 2 + level * 2;
  const selectedPairs = concepts.slice(0, pairsCount);
  const cardsData = [];

  selectedPairs.forEach(([concept, meaning]) => {
    cardsData.push({ text: concept, matchId: concept });
    cardsData.push({ text: meaning, matchId: concept });
  });

  shuffle(cardsData);
  setBoardGrid(pairsCount);

  cardsData.forEach(data => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.matchId = data.matchId;
    card.textContent = data.text;

    card.addEventListener("click", () => handleCardClick(card));
    gameBoard.appendChild(card);
  });

  startTimer();
}

function setBoardGrid(pairsCount) {
  const columns = Math.min(pairsCount, 6);
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 100px)`;
}

function handleCardClick(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.matchId === card2.dataset.matchId) {
    matchedPairs++;
    flippedCards = [];

    if (matchedPairs === (gameBoard.children.length / 2)) {
      stopTimerAndSave();
      messageElement.textContent = "✅ Nível vencido!";
      setTimeout(() => {
        if (level < maxLevel) {
          setupLevel(++level);
        } else {
          showFinalTime();
        }
      }, 1500);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 1000);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `⏱️ Tempo: ${elapsed}s`;
  }, 1000);
}

function stopTimerAndSave() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  phaseTimes.push(elapsed);

  const timeEntry = document.createElement("div");
  timeEntry.textContent = `Fase ${phaseTimes.length}: ${elapsed}s`;
  phaseTimesDisplay.appendChild(timeEntry);
}

function showFinalTime() {
  const total = phaseTimes.reduce((a, b) => a + b, 0);
  const totalEntry = document.createElement("div");
  totalEntry.innerHTML = `<strong>⏳ Tempo total: ${total}s</strong>`;
  phaseTimesDisplay.appendChild(totalEntry);
  messageElement.textContent = "🎉 Parabéns! Você concluiu todas as fases!";
}

setupLevel(level);
