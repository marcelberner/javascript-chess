import { game } from "./Game";

export class Timer {
  whiteClock: HTMLDivElement;
  blackClock: HTMLDivElement;
  whiteTimerMinutes: number;
  whiteTimerSeconds: number;
  blackTimerMinutes: number;
  blackTimerSeconds: number;
  whiteClockInterval: NodeJS.Timer | number | null;
  blackClockInterval: NodeJS.Timer | number | null;
  timerFlag: boolean;

  constructor() {
    this.whiteTimerMinutes = 10;
    this.whiteTimerSeconds = 0;
    this.blackTimerMinutes = 10;
    this.blackTimerSeconds = 0;

    this.whiteClock = document.querySelector(".white-clock")!;
    this.blackClock = document.querySelector(".black-clock")!;

    this.whiteClockInterval = null;
    this.blackClockInterval = null;

    this.timerFlag = true;
  }

  timerStop() {
    if (this.blackClockInterval) clearInterval(this.blackClockInterval as number);
    if (this.whiteClockInterval) clearInterval(this.whiteClockInterval as number as number);
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
    if (this.blackClockInterval) clearInterval(this.blackClockInterval as number);
    this.whiteClockInterval = setInterval(() => {
      if (this.whiteTimerSeconds == 0) {
        this.whiteTimerSeconds = 60;
        this.whiteTimerMinutes--;
      }
      this.whiteTimerSeconds--;

      this.setWhiteTimer();

      if (this.whiteTimerSeconds == 0 && this.whiteTimerMinutes == 0) {
        this.timerStop();
        game.endGame();
      }
    }, 1000);
  }

  timerBlack() {
    if (this.whiteClockInterval) clearInterval(this.whiteClockInterval as number);
    this.blackClockInterval = setInterval(() => {
      if (this.blackTimerSeconds == 0) {
        this.blackTimerSeconds = 60;
        this.blackTimerMinutes--;
      }
      this.blackTimerSeconds--;
      this.setBlackTimer();
      if (this.blackTimerSeconds == 0 && this.blackTimerMinutes == 0) {
        this.timerStop();
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

  getTimer(playerColor: string) {
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
    else throw new Error("Unexpected error");
  }
}

export const timer = new Timer();
