import { chessboard } from "./Chessboard";
import { button } from "./Button";
import { timer } from "./Timer";
import { modal } from "./Modal";
import { points } from "./Points";
import { moveList } from "./MoveList";

class Game {
  playerMoveSwitch: boolean;
  gameIsStarted: boolean;
  gamePaused: boolean;
  playerColor: "white" | "black";

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

    chessboard.squaresArray.forEach(
      (square) => square.firstElementChild && square.firstElementChild!.remove()
    );
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
