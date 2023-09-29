import "./style.css";

// Game
// -> créer la partie
// -> destroy

// Recréer un game

// AttempGauge

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const MAX = 500;

class Attempts {
  constructor() {
    this.attempts = [];
  }

  init() {
    this.element = document.querySelector("#attemps");

    while (this.element.firstChild) {
      this.element.firstChild.remove();
    }
  }

  addAttempt(attempt, isRight) {
    this.attempts.push(attempt);

    const element = document.createElement("div");
    element.classList.add("text-xs");
    element.style.position = "absolute";

    element.innerText = isRight ? "🟢" : "x";

    const percentage = Math.min(Math.max(0, (attempt / MAX) * 100), 98);
    element.style.left = `${percentage}%`;
    element.style.top = "9px";

    this.element.appendChild(element);
  }
}

class Game {
  constructor() {
    this.targetNumber = getRandomNumber(0, MAX);
    console.log(this.targetNumber);
    this._attempt = 0;
    this.attempts = new Attempts();

    this.submitHandler = (e) => {
      this.submitGuess(e);
    };
  }

  get attempt() {
    return this._attempt;
  }

  set attempt(newAttemp) {
    this._attempt = newAttemp;
    this.attemptElement.innerText = `Attemp(s) : ${newAttemp}`;
  }

  init() {
    this.attempts.init();
    this.element = document.querySelector("#game-container");
    this.element.classList.remove("hidden");

    this.guessForm = document.querySelector("#guess-form");
    this.message = document.querySelector("#message");

    this.attemptElement = document.querySelector("#attempt");

    this.guessForm.addEventListener("submit", this.submitHandler);
    this.restartButton = document.querySelector("#restart");
  }

  submitGuess(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const guess = Number(formData.get("guess"));

    if (Number.isNaN(guess)) {
      this.message.innerText =
        "❌ Invalid guess, you need to use a valid number";
      return;
    }

    this.attempt++;
    form.querySelector("input").value = "";

    this.attempts.addAttempt(guess, guess === this.targetNumber);

    if (guess === this.targetNumber) {
      this.message.innerText = `🟢 You've found my guess, it's ${this.targetNumber}`;
      this.restartButton.classList.remove("hidden");
      return;
    }

    if (guess > this.targetNumber) {
      const isAlredyHigh = this.message.innerText.includes("high");
      const getLastChar = Number(this.message.innerText.slice(-1)) || 1;
      this.message.innerText = `🔴 Your guess is too high. ${
        isAlredyHigh ? `x${getLastChar + 1}` : ""
      }`;
    }

    if (guess < this.targetNumber) {
      const isAlredyLow = this.message.innerText.includes("low");
      const getLastChar = Number(this.message.innerText.slice(-1)) || 1;
      this.message.innerText = `🔴 Your guess is too low. ${
        isAlredyLow ? `x${getLastChar + 1}` : ""
      }`;
    }
  }

  destroy() {
    this.element.classList.add("hidden");
    this.guessForm.removeEventListener("form", this.submitHandler);
    this.message.innerText = "";
    this.attemptElement.innerText = "Attemp(s) : 0";
    this.restartButton.classList.add("hidden");
  }
}

let game = null;
const toggleGame = () => {
  const startContainer = document.querySelector("#start-container");
  startContainer.classList.add("hidden");

  if (game) {
    game.destroy();
  }
  game = new Game();
  game.init();
};

const startButton = document.querySelector("#start");
startButton.addEventListener("click", toggleGame);

const restartButton = document.querySelector("#restart");
restartButton.addEventListener("click", toggleGame);
