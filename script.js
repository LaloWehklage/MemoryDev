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
  ["REST", "Arquitetura de APIs"],
  ["Back-end", "Lógica e processamento no servidor"],
  ["Front-end", "Interface e interação com o usuário"],
  ["DevOps", "Integração entre desenvolvimento e operações"],
  ["UML", "Linguagem de modelagem de sistemas"],
  ["Deploy", "Publicação de uma aplicação"],
  ["Refatoração", "Melhoria do código sem alterar funcionalidade"],
  ["Escalabilidade", "Capacidade de crescer sem perder desempenho"],
  ["Alta Disponibilidade", "Sistema sempre acessível"],
  ["Load Balancer", "Distribuição de carga entre servidores"],
  ["Cache", "Armazenamento temporário para acelerar acesso"],
  ["Firewall", "Barreira de proteção contra acessos indevidos"],
  ["Criptografia", "Proteção de dados por codificação"],
  ["Autenticação", "Verificação de identidade do usuário"],
  ["Autorização", "Permissão de acesso a recursos"],
  ["Log", "Registro de eventos do sistema"],
  ["Monitoramento", "Acompanhamento da saúde do sistema"],
  ["Rollback", "Reversão de uma versão de sistema"],
  ["Endpoint", "Ponto de acesso de uma API"],
  ["Middleware", "Camada intermediária entre sistemas"],
  ["Serviço", "Componente que executa uma função específica"],
  ["Thread", "Unidade de execução paralela"],
  ["Escopo", "Limite de visibilidade de variáveis"],
  ["Pipeline", "Fluxo automatizado de processos"],
  ["Ambiente de Produção", "Sistema em uso real por usuários"],
  ["Ambiente de Homologação", "Sistema para testes finais"],
  ["Ambiente de Desenvolvimento", "Sistema para criação e testes iniciais"],
  ["Singleton", "Padrão que garante uma única instância"],
  ["Observer", "Padrão que reage a mudanças de estado"],
  ["Service Layer", "Camada que organiza regras de negócio"],
  ["Repository", "Camada de acesso a dados"]

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

