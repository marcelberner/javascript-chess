import { Pieces } from "./Pieces";
import { move } from "./Move";
import { game } from "./Game";

class Chessboard {
  chessboardContainer: HTMLDivElement;
  chessboard: HTMLDivElement;
  cords: NodeListOf<HTMLDivElement>;
  squaresArray: HTMLDivElement[];
  chessboardSnapshot: HTMLDivElement[] | undefined;
  count: number;
  constructor() {
    this.chessboardContainer = document.querySelector(".chessboard-container")!;
    this.chessboard = document.querySelector(".chessboard")!;
    this.cords = document.querySelectorAll(".cord")!;
    this.chessboardSnapshot;
    this.squaresArray = [];
    this.count = 0;
  }

  selectSquareHandler(square: HTMLDivElement) {
    square.addEventListener("click", () => this.selectSquare(square));
  }

  selectSquare(square: HTMLDivElement) {
    if (game.gameIsStarted && !game.gamePaused) {
      if (this.count == 0 && square.hasChildNodes()) {
        move.clearSelect();
        square.classList.add("selected");
        this.selectPieceToMove(square);
      }

      if (move.selectedPiece == null) return;
      this.count++;

      if (this.count == 2) {
        const playerColor = game.checkPlayerColor();
        const pieceColor = square.hasChildNodes()
          ? (square.firstChild! as HTMLElement).dataset.piececolor
          : "";

        if (playerColor == pieceColor) {
          this.selectOtherPiece(square);
        } else this.movePieceTo(square);
      }
    }
  }

  selectOtherPiece(square: HTMLDivElement) {
    this.count = 0;
    this.selectSquare(square);
  }

  selectPieceToMove(square: HTMLDivElement) {
    let piece;

    if(square.firstChild == null) return;
    else piece = square.firstChild as HTMLDivElement;

    const pieceType = piece.dataset.piecetype;
    move.setSelectedPiece(piece, pieceType!);
  }

  movePieceTo(square: HTMLDivElement) {
    this.count = 0;

    this.lookForEnemies(square);
    move.checkCanMove(move.selectedPiece!, square, move.pieceType!);
  }

  lookForEnemies(square: HTMLDivElement) {
    const playerColor = game.checkPlayerColor();

    if (square.hasChildNodes()) {
      if (
        (square.firstChild! as HTMLElement).dataset.piececolor != playerColor
      ) {
        move.enemyPiece = {
          piece: square.firstChild as HTMLDivElement,
          type: (square.firstChild as HTMLDivElement).dataset.piecetype!,
          color: (square.firstChild as HTMLDivElement).dataset.piececolor!,
          square: square,
        };
      } else {
        return;
      }
    }
  }

  rotate() {
    this.chessboard.classList.toggle("rotate");
    this.chessboardContainer.classList.toggle("reverse");

    this.squaresArray.forEach((e) => e.firstElementChild && e.firstElementChild!.classList.toggle("rotate"));

    this.cords.forEach((e) => e.classList.toggle("rotate"));
  }

  takeSnapshot() {
    this.chessboardSnapshot = this.squaresArray.map(
      (square) => square.cloneNode(true) as HTMLDivElement
    );
  }

  recoverSnapshot() {
    this.squaresArray.forEach((node) => {
      if (node.dataset && node.dataset.mark) node.innerHTML = "";
    });

    this.squaresArray.forEach((square) => {
      const squareMark = square.dataset.mark;

      const squareSnapshot = this.chessboardSnapshot?.find(
        (square) => square.dataset.mark == squareMark
      );

      squareSnapshot?.firstElementChild &&
        square.appendChild(squareSnapshot?.firstElementChild!);
    });
  }

  lockSquare() {
    this.squaresArray.forEach((e) => {
      if (e.hasChildNodes()) {
        const pieceType = (e.firstChild as HTMLElement).dataset.piecetype;
        const pieceColor = (e.firstChild as HTMLElement).dataset.piececolor;
        const cordsArray = move.cordsArray;
        const cords = e.dataset.mark;
        let cordsIndex = cordsArray.indexOf(cords![0]);

        if (pieceType == "pawn") {
          this.lockByPawn(cords!, cordsIndex, pieceColor!);
        } else if (pieceType == "knight") {
          this.lockByKnight(cords!, cordsIndex, pieceColor!);
        } else if (pieceType == "rook") {
          this.lockByRook(cordsArray, cords!, pieceColor!);
        } else if (pieceType == "bishop") {
          this.lockByBishop(cordsArray, cords!, cordsIndex, pieceColor!);
        } else if (pieceType == "queen") {
          this.lockByBishop(cordsArray, cords!, cordsIndex, pieceColor!);
          this.lockByRook(cordsArray, cords!, pieceColor!);
        } else if (pieceType == "king") {
          this.lockByKing(cords!, cordsIndex, pieceColor!);
        }
      }
    });
  }

  lockByPawn(cords: string, cordsIndex: number, pieceColor: string) {
    const pawnMoveset = move.getPawnMoveset(cords, cordsIndex, pieceColor)

    const squaresToLock = this.squaresArray.filter((e) => (pawnMoveset.attackLeft && e.dataset.mark == pawnMoveset.attackLeft || 
      (pawnMoveset.attackRight && e.dataset.mark == pawnMoveset.attackRight)));

    squaresToLock.forEach(square =>{
      if(pieceColor == "white") square.dataset.lock_for_black = "true";
      else square.dataset.lock_for_white = "true";
    });
  }
  
  lockByKnight(cords : string, cordsIndex: number, pieceColor : string, protect? : boolean) {
    const knightMoveset = move.getKnightMoveset(cords, cordsIndex);
    const squaresToLock = knightMoveset.map(move => this.squaresArray.find(square => square.dataset.mark == move));
    
    squaresToLock.forEach((e) => {
      if (e != undefined) {
        if (pieceColor == "white") e.dataset.lock_for_black = "true";
        else e.dataset.lock_for_white = "true";
        if(protect) e.appendChild(document.createElement("div"));
        if(protect && e.hasChildNodes()) {
          e.firstElementChild?.remove();
          e.appendChild(document.createElement("div"));
        }
      }
    });
  }
  
  lockByKing(cords : string, cordsIndex: number, pieceColor : string) {
    const kingMoveset = move.getKingMoveset(cords, cordsIndex);
    const squaresToLock = kingMoveset.map(move => this.squaresArray.find(square => square.dataset.mark == move));

    squaresToLock.forEach((e) => {
      if (e != undefined) {
        if (pieceColor == "white") e.dataset.lock_for_black = "true";
        if (pieceColor == "black") e.dataset.lock_for_white = "true";
      }
    });
  }

  lockByBishop(cordsArray : string[], cords : string, cordsIndex: number, pieceColor : string, protect? : boolean) {
    let topLeftLoopStoper = false;
    let topRighttLoopStoper = false;
    let bottomLeftLoopStoper = false;
    let bottomRightLoopStoper = false;

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!topLeftLoopStoper) {
          if (mark == cords) continue;
          if (
            mark == `${cordsArray[cordsIndex - i]}${parseInt(cords[1]) + i}`
          ) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) topLeftLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!bottomLeftLoopStoper) {
          if (mark == cords) continue;
          if (
            mark == `${cordsArray[cordsIndex - i]}${parseInt(cords[1]) - i}`
          ) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) bottomLeftLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!topRighttLoopStoper) {
          if (mark == cords) continue;
          if (
            mark == `${cordsArray[cordsIndex + i]}${parseInt(cords[1]) + i}`
          ) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) topRighttLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!bottomRightLoopStoper) {
          if (mark == cords) continue;
          if (
            mark == `${cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`
          ) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) bottomRightLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }
  }

  lockByRook(cordsArray : string[], cords : string, pieceColor : string, protect? : boolean) {
    let topLoopStoper = false;
    let leftLoopStoper = false;
    let bottomLoopStoper = false;
    let rightLoopStoper = false;

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!topLoopStoper) {
          if (mark == `${cords[0]}${parseInt(cords[1]) + 1 + i}`) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) topLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!bottomLoopStoper) {
          if (mark == `${cords[0]}${parseInt(cords[1]) - 1 - i}`) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) bottomLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!leftLoopStoper) {
          if (
            mark ==
            `${cordsArray[parseInt(cordsArray.indexOf(cords[0]) as any) + 1 + i]}${
              cords[1]
            }`
          ) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) leftLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!rightLoopStoper) {
          if (
            mark ==
            `${cordsArray[parseInt(cordsArray.indexOf(cords[0]) as any ) - 1 - i]}${
              cords[1]
            }`
          ) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) rightLoopStoper = true;
            if(protect) e.appendChild(document.createElement("div"));
            if(protect && e.hasChildNodes()) {
              e.firstElementChild?.remove();
              e.appendChild(document.createElement("div"));
            }
          }
        }
      }
    }
  }


  clearLock() {
    this.squaresArray.forEach((e) => {
      e.dataset.lock_for_white = "false";
      e.dataset.lock_for_black = "false";
    });
  }

  findSquare(mark : string) {
    return this.squaresArray.find(square => square.dataset.mark == mark)
  }

  generateBoard() {
    let flag = true;
    let color = null;

    const cordsTemplate = {
      letter: ["h","g","f","e","d","c","b","a"],
      number: ["8","7","6","5","4","3","2","1"]
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 8; j >= 1; j--) {

        color = flag ? "white" : "black";
        if (j == 1) flag = !flag;

        const mark = `${cordsTemplate.letter[j - 1] + cordsTemplate.number[i]}`;

        const square = document.createElement("div");

        square.dataset.mark = mark;
        square.dataset.lock_for_white = "false";
        square.dataset.lock_for_black = "false";
        square.classList.add("square", color);

        this.selectSquareHandler(square);
        this.squaresArray.push(square);
        this.chessboard.appendChild(square);

        const piece = new Pieces(square);
        piece.createPiece(mark);

        flag = !flag;
      }
    }
  }

  removeSquares() {
    this.squaresArray.forEach((square) => square.remove());
  }
}

export const chessboard = new Chessboard();
