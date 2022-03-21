import { chessboard } from "./chessboard.js";
import { button } from "./button.js";
import { timer } from "./timer.js";
import { modal } from "./modal.js";
import { points } from "./points.js";
import { PIECES_ARRAY } from "./pieces.js";
import { moveList } from "./moveList.js";

class Game {
  constructor() {
    this.playerMoveSwitch = true;
    this.gameIsStarted = false;
    this.gamePaused = false;
    this.playerColor = this.playerMoveSwitch ? "white" : "black";
  }
  
  init() {
    chessboard.generateBoard();

    button.button.addEventListener("click", () => {
      if (this.gamePaused) return;
      button.changeButtonState();
      !this.gameIsStarted ? this.start() : this.endGame();
    });

    button.restartButton.addEventListener("click", () => this.restart());
  }

  start() {
    timer.timerStart();
    this.gameIsStarted = true;
  }

  endGame() {
    this.gamePaused = true;
    this.gameIsStarted = false;
    
    timer.timerStop();
    modal.updateModal();
    modal.changeModalState();
    button.buttonDisableState();
  }

  restart() {
    this.gamePaused = false;
    this.gameIsStarted = true;
    this.playerMoveSwitch = true;

    modal.changeModalState();

    button.buttonDisableState();

    PIECES_ARRAY.forEach((piece) => piece.remove());
    chessboard.removeSquares();
    chessboard.generateBoard();

    chessboard.chessboard.classList.remove("rotate");
    chessboard.chessboardContainer.classList.remove("reverse");
    chessboard.cords.forEach((e) => e.classList.remove("rotate"));

    timer.timerFlag = true;
    timer.timerClear();
    timer.timerStart();

    points.pointsClear();

    moveList.clearList();
  }

  checkPlayerColor() {
    const playerColor = this.playerMoveSwitch ? "white" : "black";
    return playerColor;
  }
}

export const game = new Game();
game.init();
