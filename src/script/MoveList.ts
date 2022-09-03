import { move } from "./Move";

class MoveList {
  moveList: HTMLDivElement;
  constructor() {
    this.moveList = document.querySelector(".move-list")!;
  }

  drawMove(square : HTMLDivElement , pieceType : string) {
    if (move.moveCount % 2 == 1) {
      this.drawNewLine(square, pieceType);
    } 
    else {
      const pieceIcon = document.createElement("i");
      pieceIcon.classList.add("fas", `fa-chess-${pieceType}`, "tour-icon");

      const newMove = document.createElement("span");
      newMove.classList.add("move");
      newMove.innerHTML += square.dataset.mark;

      this.moveList.lastChild!.appendChild(pieceIcon);
      this.moveList.lastChild!.appendChild(newMove);
    }
  }

  drawNewLine(square : HTMLDivElement, pieceType : string) {
    const newContainer = document.createElement("div");
    newContainer.classList.add("move-container");

    const pieceIcon = document.createElement("i");
    pieceIcon.classList.add("fas", `fa-chess-${pieceType}`, "tour-icon");

    const newMove = document.createElement("span");
    newMove.classList.add("move");
    newMove.textContent = square.dataset.mark!;

    const newTour = document.createElement("span");
    newTour.classList.add("tour");
    newTour.textContent = move.tourCount.toString();

    this.moveList.appendChild(newContainer);
    newContainer.appendChild(newTour);
    newContainer.appendChild(pieceIcon);
    newContainer.appendChild(newMove);
  }

  clearList() {
    move.moveCount = 0;
    move.tourCount = 1;

    this.moveList.textContent = "";
  }
}

export const moveList = new MoveList();
