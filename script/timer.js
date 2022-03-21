import { game } from "./game.js";

export class Timer {
  constructor(whiteClock, blackClock) {
    this.whiteTimerMinutes = 10;
    this.whiteTimerSeconds = 0;
    this.blackTimerMinutes = 10;
    this.blackTimerSeconds = 0;

    this.whiteClock = whiteClock;
    this.blackClock = blackClock;

    this.whiteClockInterval = null;
    this.blackClockInterval = null;

    this.timerFlag = true;
  }

  timerStop() {
    if (this.blackClockInterval) clearInterval(this.blackClockInterval);
    if (this.whiteClockInterval) clearInterval(this.whiteClockInterval);
  }

  setBlackTimer() {
    this.blackClock.textContent = `${this.blackTimerMinutes}:${
      this.blackTimerSeconds < 10
        ? "0" + this.blackTimerSeconds
        : this.blackTimerSeconds
    }`;
  }

  setWhiteTimer() {
    this.whiteClock.textContent = `${this.whiteTimerMinutes}:${
      this.whiteTimerSeconds < 10
        ? "0" + this.whiteTimerSeconds
        : this.whiteTimerSeconds
    }`;
  }

  timerClear() {
    this.whiteTimerMinutes = 10;
    this.whiteTimerSeconds = 0;
    this.blackTimerMinutes = 10;
    this.blackTimerSeconds = 0;

    this.setBlackTimer();
    this.setWhiteTimer();
  }

  timerWhite() {
    if (this.blackClockInterval) clearInterval(this.blackClockInterval);
    this.whiteClockInterval = setInterval(() => {
      if (this.whiteTimerSeconds == 0) {
        this.whiteTimerSeconds = 60;
        this.whiteTimerMinutes--;
      }
      this.whiteTimerSeconds--;

      this.setWhiteTimer();

      if (this.whiteTimerSeconds == 0 && this.whiteTimerMinutes == 0) {
        this.timerStop(this.whiteClockInterval);
        game.endGame();
      }
    }, 1000);
  }

  timerBlack() {
    if (this.whiteClockInterval) clearInterval(this.whiteClockInterval);
    this.blackClockInterval = setInterval(() => {
      if (this.blackTimerSeconds == 0) {
        this.blackTimerSeconds = 60;
        this.blackTimerMinutes--;
      }
      this.blackTimerSeconds--;
      this.setBlackTimer();
      if (this.blackTimerSeconds == 0 && this.blackTimerMinutes == 0) {
        this.timerStop(this.blackClockInterval);
        game.endGame();
      }
    }, 1000);
  }

  timerStart() {
    if (this.timerFlag) {
      this.timerWhite();
    } else {
      this.timerBlack();
    }
    this.timerFlag = !this.timerFlag;
  }

  getTimer(playerColor) {

    if (playerColor == "white")
      return `${this.blackTimerMinutes}:${
        this.blackTimerSeconds < 10
          ? "0" + this.blackTimerSeconds
          : this.blackTimerSeconds
      }`;

    else if (playerColor == "black")
      return `${this.whiteTimerMinutes}:${
        this.whiteTimerSeconds < 10
          ? "0" + this.whiteTimerSeconds
          : this.whiteTimerSeconds
      }`;
  }
}

export const timer = new Timer(
  document.querySelector(".white-clock"),
  document.querySelector(".black-clock")
);
