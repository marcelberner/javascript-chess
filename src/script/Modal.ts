import { game } from "./Game";
import { move } from "./Move";
import { points } from "./Points";
import { timer } from "./Timer";

class Modal {
  modal: HTMLDivElement;
  winnerInfo: HTMLSpanElement;
  tourInfo: HTMLSpanElement;
  timerInfo: HTMLSpanElement;
  pointsInfo: HTMLSpanElement;

  constructor() {
    this.modal = document.querySelector(".modal")!;
    this.winnerInfo = document.querySelector(".winner")!;
    this.tourInfo = document.querySelector(".info-tour")!;
    this.timerInfo = document.querySelector(".info-timer")!;
    this.pointsInfo = document.querySelector(".info-points")!;
  }

  changeModalState() {
    this.modal.classList.toggle("show");
  }

  updateModal() {
    this.setHeader();
    this.setBody();
  }

  setHeader() {
    const winner = game.checkPlayerColor() == "white" ? "Czarny" : "Biały";

    this.winnerInfo.textContent = winner;
  }

  setBody() {
    const finalTime = timer.getTimer(game.checkPlayerColor());
    const tourCount = move.tourCount;
    const pointsAdvantage = points.advantage;

    this.tourInfo.textContent = tourCount.toString();
    this.timerInfo.textContent = finalTime;
    this.pointsInfo.textContent = pointsAdvantage.toString();
  }
}

export const modal = new Modal();
