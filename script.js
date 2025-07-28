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
const levelElement = document.getElementById("level");
const gameBoard = document.getElementById("gameBoard");
const messageElement = document.getElementById("message");
let flippedCards = [];
let matchedPairs = 0;

function setupLevel(level) {
  messageElement.textContent = "";
  flippedCards = [];
  matchedPairs = 0;
  levelElement.textContent = level;
  gameBoard.innerHTML = "";

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
      messageElement.textContent = "✅ Nível vencido!";
      setTimeout(() => setupLevel(++level), 1500);
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

setupLevel(level);