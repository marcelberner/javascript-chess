import { game } from "./game.js";
import { move } from "./move.js";
import { points } from "./points.js";
import { timer } from "./timer.js";

class Modal {
  constructor(modal, winnerInfo, tourInfo, timerInfo, pointsInfo) {
    this.modal = modal;
    this.winnerInfo = winnerInfo;
    this.tourInfo = tourInfo;
    this.timerInfo = timerInfo;
    this.pointsInfo = pointsInfo;
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

    this.tourInfo.textContent = tourCount;
    this.timerInfo.textContent = finalTime;
    this.pointsInfo.textContent = pointsAdvantage;
  }
}

export const modal = new Modal(
  document.querySelector(".modal"),
  document.querySelector(".winner"),
  document.querySelector(".info-tour"),
  document.querySelector(".info-timer"),
  document.querySelector(".info-points")
);
