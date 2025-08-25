const conceitos = [
  ["HTML", "Linguagem de marcação"],
  ["CSS", "Estilo visual"],
  ["JavaScript", "Lógica do site"],
  ["React", "Biblioteca JS"],
  ["Node.js", "Back-end JS"],
  ["API", "Interface de programação"],
  ["Git", "Controle de versão"],
  ["SQL", "Banco de dados relacional"],
];

let nivel = 1;
let totalDeFases = conceitos.length;
let timerInterval;
let startTime;
let phaseTimes = [];

const gameBoard = document.getElementById("gameBoard");
const levelDisplay = document.getElementById("level");
const messageDisplay = document.getElementById("message");

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timer").textContent = `⏱️ Tempo: ${elapsed}s`;
  }, 1000);
}

function stopTimerAndSave() {
  clearInterval(timerInterval);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  phaseTimes.push(elapsed);

  const phaseTimesDiv = document.getElementById("phaseTimes");
  const newTime = document.createElement("div");
  newTime.textContent = `Fase ${phaseTimes.length}: ${elapsed}s`;
  phaseTimesDiv.appendChild(newTime);

  if (phaseTimes.length === totalDeFases) {
    const total = phaseTimes.reduce((a, b) => a + b, 0);
    const totalDiv = document.createElement("div");
    totalDiv.innerHTML = `<strong>⏳ Tempo total: ${total}s</strong>`;
    phaseTimesDiv.appendChild(totalDiv);
  }
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function criarTabuleiro(nivel) {
  gameBoard.innerHTML = "";
  messageDisplay.textContent = "";
  levelDisplay.textContent = `Fase: ${nivel}`;
  document.getElementById("timer").textContent = "⏱️ Tempo: 0s";

  const pares = conceitos.slice(0, nivel);
  const cartas = embaralhar([...pares, ...pares].flat());

  cartas.forEach((texto) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = texto;
    card.dataset.valor = texto;
    card.addEventListener("click", virarCarta);
    gameBoard.appendChild(card);
  });

  startTimer();
}

let primeiraCarta = null;
let bloqueado = false;

function virarCarta() {
  if (bloqueado || this.classList.contains("flipped")) return;

  this.classList.add("flipped");

  if (!primeiraCarta) {
    primeiraCarta = this;
  } else {
    const segundaCarta = this;
    const parValido = validarPar(primeiraCarta.dataset.valor, segundaCarta.dataset.valor);

    if (parValido) {
      primeiraCarta = null;
      verificarFimDaFase();
    } else {
      bloqueado = true;
      setTimeout(() => {
        primeiraCarta.classList.remove("flipped");
        segundaCarta.classList.remove("flipped");
        primeiraCarta = null;
        bloqueado = false;
      }, 1000);
    }
  }
}

function validarPar(valor1, valor2) {
  return conceitos.some(([a, b]) =>
    (a === valor1 && b === valor2) || (a === valor2 && b === valor1)
  );
}

function verificarFimDaFase() {
  const todasFlipped = [...document.querySelectorAll(".card")].every(card =>
    card.classList.contains("flipped")
  );

  if (todasFlipped) {
    stopTimerAndSave();
    if (nivel < totalDeFases) {
      messageDisplay.textContent = "✅ Fase concluída! Indo para a próxima...";
      setTimeout(() => {
        nivel++;
        criarTabuleiro(nivel);
      }, 1500);
    } else {
      messageDisplay.textContent = "🎉 Parabéns! Você concluiu todas as fases!";
    }
  }
}

criarTabuleiro(nivel);
