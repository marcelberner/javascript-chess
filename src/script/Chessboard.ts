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

///////////////////////////////////////////////////////////////////////////////////////////////
// MOVE RELATED METHODS ///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

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
          ? (square.firstElementChild as HTMLElement).dataset.piececolor
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
    const piece = square.firstElementChild as HTMLDivElement;

    if(!piece) return;

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
    const piece = square.firstElementChild as HTMLDivElement;

    if (square.hasChildNodes() && piece.dataset.piececolor != playerColor) {
      move.enemyPiece = {
        piece: piece,
        type: piece.dataset.piecetype!,
        color: piece.dataset.piececolor!,
        square: square,
      };
    }
  }

///////////////////////////////////////////////////////////////////////////////////////////////
// BOARD RELATED METHODS///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
  
  rotate() {
    this.chessboard.classList.toggle("rotate");
    this.chessboardContainer.classList.toggle("reverse");
    
    this.squaresArray.forEach(square => square.firstElementChild && square.firstElementChild.classList.toggle("rotate"));
    this.cords.forEach((e) => e.classList.toggle("rotate"));
  }
  
  takeSnapshot() {
    this.chessboardSnapshot = this.squaresArray.map(square => square.cloneNode(true) as HTMLDivElement);
  }
    
  recoverSnapshot() {
    this.squaresArray.forEach(square => {
      if (square.dataset && square.dataset.mark) square.innerHTML = "";
    });
  
    this.squaresArray.forEach(square => {
      const squareMark = square.dataset.mark;
      const squareSnapshot = this.chessboardSnapshot?.find(square => square.dataset.mark == squareMark);
        
      squareSnapshot?.firstElementChild &&
      square.appendChild(squareSnapshot?.firstElementChild!);
    });
  }

  findSquare(mark : string) {
    return this.squaresArray.find(square => square.dataset.mark == mark)
  }

  removeSquares() {
    this.squaresArray.forEach(square => square.remove());
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

///////////////////////////////////////////////////////////////////////////////////////////////
// PIECE RELATED METHODS///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
      
  protectKing(square : HTMLDivElement) {
    const playerColor = game.checkPlayerColor();
    const piece = square.firstElementChild as HTMLDivElement;

    if(square.hasChildNodes() && piece.dataset.piececolor && piece.dataset.piececolor != playerColor) {
      square.firstElementChild!.remove();
      square.appendChild(document.createElement("div"));
    }
    else square.appendChild(document.createElement("div"));    
  }

  lockSquare() {
    this.squaresArray.forEach(square => {
      if (square.hasChildNodes()) {
        const piece = square.firstElementChild as HTMLDivElement;
        const pieceType = piece.dataset.piecetype;
        const pieceColor = piece.dataset.piececolor;
        const cordsArray = move.cordsArray;
        const cords = square.dataset.mark;
        let cordsIndex = cordsArray.indexOf(cords![0]);
        
        if (pieceType == "pawn") this.lockByPawn(cords!, cordsIndex, pieceColor!);
        else if (pieceType == "knight") this.lockByKnight(cords!, cordsIndex, pieceColor!);
        else if (pieceType == "rook") this.lockByRook(cordsArray, cords!, pieceColor!);
        else if (pieceType == "bishop") this.lockByBishop(cordsArray, cords!, cordsIndex, pieceColor!);
        else if (pieceType == "king") this.lockByKing(cords!, cordsIndex, pieceColor!);
        else if (pieceType == "queen"){
          this.lockByBishop(cordsArray, cords!, cordsIndex, pieceColor!);
          this.lockByRook(cordsArray, cords!, pieceColor!);
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
        if(protect) this.protectKing(e);
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
            if(protect) this.protectKing(e);
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
            if(protect) this.protectKing(e);
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
            if(protect) this.protectKing(e);
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!bottomRightLoopStoper) {
          if (mark == cords) continue;
          if (mark == `${cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) bottomRightLoopStoper = true;
            if(protect) this.protectKing(e);
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
            if(protect) this.protectKing(e);
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
            if(protect) this.protectKing(e);
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!leftLoopStoper) {
          if (mark ==`${cordsArray[parseInt(cordsArray.indexOf(cords[0]) as any) + 1 + i]}${cords[1]}`) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) leftLoopStoper = true;
            if(protect) this.protectKing(e);
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for (let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if (!rightLoopStoper) {
          if (mark ==`${cordsArray[parseInt(cordsArray.indexOf(cords[0]) as any ) - 1 - i]}${cords[1]}`) {
            if (pieceColor == "white") e.dataset.lock_for_black = "true";
            if (pieceColor == "black") e.dataset.lock_for_white = "true";
            if (e.hasChildNodes()) rightLoopStoper = true;
            if(protect) this.protectKing(e);
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
}

export const chessboard = new Chessboard();
