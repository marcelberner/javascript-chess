import { game } from "./Game";

export class Timer {
  whiteClock: HTMLDivElement;
  blackClock: HTMLDivElement;
  whiteTimerMinutes: number;
  whiteTimerSeconds: number;
  blackTimerMinutes: number;
  blackTimerSeconds: number;
  whiteClockInterval: NodeJS.Timer | null;
  blackClockInterval: NodeJS.Timer | null;
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

  setBlackTimer() {
    this.blackClock.textContent = `${this.blackTimerMinutes}:${this.blackTimerSeconds < 10
      ? "0" + this.blackTimerSeconds
      : this.blackTimerSeconds}`;
  }
    
  setWhiteTimer() {
    this.whiteClock.textContent = `${this.whiteTimerMinutes}:${this.whiteTimerSeconds < 10
      ? "0" + this.whiteTimerSeconds
      : this.whiteTimerSeconds}`;
  }
    
  timerClear() {
    this.whiteTimerMinutes = 10;
    this.whiteTimerSeconds = 0;
    this.blackTimerMinutes = 10;
    this.blackTimerSeconds = 0;
    
    this.setBlackTimer();
    this.setWhiteTimer();
  }

  timerRules(playerColor : string) {
    if ((playerColor == "black" && this.blackTimerSeconds == 0) || playerColor == "white" && this.whiteTimerSeconds == 0) {
      playerColor == "black" ? this.blackTimerSeconds = 60 : this.whiteTimerSeconds = 60;
      playerColor == "black" ? this.blackTimerMinutes-- : this.whiteTimerMinutes--;
    }
    playerColor == "black" ? this.blackTimerSeconds-- : this.whiteTimerSeconds--;
    playerColor == "black" ? this.setBlackTimer() : this.setWhiteTimer();

    if ((this.blackTimerSeconds == 0 && this.blackTimerMinutes == 0) 
    || (this.whiteTimerSeconds == 0 && this.whiteTimerMinutes == 0)) {
      this.timerStop();
      game.endGame();
    }
  }
  
  timerStart() {
    const playerColor = game.checkPlayerColor();

    clearInterval(this.whiteClockInterval!);
    clearInterval(this.blackClockInterval!);
    
    if(playerColor == "white") this.whiteClockInterval = setInterval(() => this.timerRules(playerColor), 1000);
    if(playerColor == "black") this.blackClockInterval = setInterval(() => this.timerRules(playerColor), 1000);
  }
  
  timerStop() {
    const playerColor = game.checkPlayerColor();
    playerColor == "white" ? clearInterval(this.whiteClockInterval!) : clearInterval(this.blackClockInterval!);
  }

  getTimer(playerColor: string) {
    if (playerColor == "white") return `${this.blackTimerMinutes}:${this.blackTimerSeconds < 10
      ? "0" + this.blackTimerSeconds
      : this.blackTimerSeconds}`;
    else return `${this.whiteTimerMinutes}:${this.whiteTimerSeconds < 10 
      ? "0" + this.whiteTimerSeconds 
      : this.whiteTimerSeconds}`;
  }
}

export const timer = new Timer();
