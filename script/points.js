import { game } from "./game.js";

class Points {
  constructor(whitePointsBar, blackPointsBar) {
    this.whitePointsBar = whitePointsBar;
    this.blackPointsBar = blackPointsBar;

    this.whitePoints = 0;
    this.blackPoints = 0;

    this.advantage = 0;

    this.piecesValue = {
      queen: 9,
      rook: 5,
      knight: 3,
      bishop: 3,
      pawn: 1,
    };
  }

  incresePlayerPoints(pieceType) {
    const playerColor = game.checkPlayerColor();
    const pointsValue = this.piecesValue[pieceType];

    if (playerColor == "white") {
      this.whitePoints += pointsValue;
    } else if (playerColor == "black") {
      this.blackPoints += pointsValue;
    }

    this.formatPoints();
  }

  formatPoints() {
    const advantage = this.whitePoints > this.blackPoints ? "white" : "black";

    if (advantage == "white") {
      this.advantage = this.whitePoints - this.blackPoints;
      this.whitePointsBar.textContent = `+${this.advantage}`;
      this.blackPointsBar.textContent = "+0";
    } else if (advantage == "black") {
      this.advantage = this.blackPoints - this.whitePoints;
      this.blackPointsBar.textContent = `+${this.advantage}`;
      this.whitePointsBar.textContent = "+0";
    } else {
      this.whitePointsBar.textContent = "+0";
      this.blackPointsBar.textContent = "+0";
    }
  }

  pointsClear() {
    this.blackPoints = 0;
    this.whitePoints = 0;

    this.formatPoints();
  }
}

export const points = new Points(
  document.querySelector(".white-points"),
  document.querySelector(".black-points")
);
