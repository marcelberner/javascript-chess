import { timer } from "./timer.js";
import { moveList } from "./moveList.js";
import { game } from "./game.js";
import { points } from "./points.js";
import { chessboard } from "./chessboard.js";

class Move {
  constructor() {
    this.cordsArray = ["a", "b", "c", "d", "e", "f", "g", "h"];

    this.selectedPiece = null;
    this.enemyPiece = null;

    this.pieceType = null;

    this.moveCount = 0;
    this.tourCount = 1;

    this.check = false;
  }

  clearSelect() {
    this.selectedPiece = null;
    this.enemyPiece = null;
    chessboard.squaresArray.forEach(e => e.classList.remove('selected'));
  }

  setSelectedPiece(piece, type) {
    this.selectedPiece = piece;
    this.pieceType = type;
  }

  preventSameMove(cords, squareCords) {
    if (cords == squareCords) return true;
  }

  preventFriendlyFire(square) {
    const playerColor = game.checkPlayerColor();

    const pieceToBeatColor = square.hasChildNodes()
      ? square.firstChild.dataset.piececolor : "";

    if (pieceToBeatColor == playerColor) return true;
    else return false;
  }

  preventWrongSquareMove(square) {
    const playerColor = game.checkPlayerColor();
    const squareLockWhite = square.dataset.lock_for_white;
    const squareLockBlack = square.dataset.lock_for_black;

    if(playerColor == 'white' && squareLockWhite == 'true') return true;
    else if(playerColor == 'black' && squareLockBlack == 'true') return true;
    else return false;
  }

  pawnMoveRules(piece, cords, squareCords, pieceColor, square, cordsIndex) {
    const firstMove = piece.dataset.firstmove;
    const canBeat = square.hasChildNodes();

    if (pieceColor == "white") {

      if (firstMove == "true") {
        if (squareCords == `${cords[0]}${parseInt(cords[1]) + 2}` && !canBeat) return true;
      }

      if (canBeat && 
        (squareCords == `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 1}` ||
          squareCords == `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 1}`)
      ) return true;

      if (squareCords == `${cords[0]}${parseInt(cords[1]) + 1}` && !canBeat) return true;

    } 
    else if (pieceColor == "black") {

      if (firstMove == "true") {
        if (squareCords == `${cords[0]}${parseInt(cords[1]) - 2}` && !canBeat) return true;
      }

      if (canBeat &&
        (squareCords ==`${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 1}` ||
          squareCords ==`${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 1}`)
      ) return true;

      if (squareCords == `${cords[0]}${parseInt(cords[1]) - 1}` && !canBeat)
        return true;
    }
  }

  rookMoveRules(cords, squareCords) {
    if (squareCords.includes(cords[0]) || squareCords.includes(cords[1])) return true;
  }

  knightMoveRules(cords, squareCords, cordsIndex) {
    const knightMoveset = [
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 2}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 2}`,
      `${this.cordsArray[cordsIndex - 2]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex - 2]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex + 2]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex + 2]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 2}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 2}`,
    ];
    if (
      squareCords == knightMoveset[0] ||
      squareCords == knightMoveset[1] ||
      squareCords == knightMoveset[2] ||
      squareCords == knightMoveset[3] ||
      squareCords == knightMoveset[4] ||
      squareCords == knightMoveset[5] ||
      squareCords == knightMoveset[6] ||
      squareCords == knightMoveset[7]
    ) {
      return true;
    }
  }

  bishopMoveRules(cords, squareCords, cordsIndex) {
    const availableSquares = [];

    for (let i = 0; i < 7; i++) {
      availableSquares.push(`${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) + i}`);
      availableSquares.push(`${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) - i}`);
      availableSquares.push(`${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) + i}`);
      availableSquares.push(`${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`);
    }

    const correctMove = availableSquares.find((e) => e == squareCords);
    
    if (correctMove) return true;
  }

  kingMoveRules(cords, squareCords, cordsIndex) {
    const kingMoveset = [
      `${this.cordsArray[cordsIndex - 1]}${cords[1]}`,
      `${this.cordsArray[cordsIndex + 1]}${cords[1]}`,
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex]}${parseInt(cords[1]) - 1}`,
    ];

    if (
      squareCords == kingMoveset[0] ||
      squareCords == kingMoveset[1] ||
      squareCords == kingMoveset[2] ||
      squareCords == kingMoveset[3] ||
      squareCords == kingMoveset[4] ||
      squareCords == kingMoveset[5] ||
      squareCords == kingMoveset[6] ||
      squareCords == kingMoveset[7]
    )
      return true;
  }

  queenMoveRules(cords, squareCords, cordsIndex) {
    if (
      this.bishopMoveRules(cords, squareCords, cordsIndex) ||
      this.rookMoveRules(cords, squareCords)
    )
      return true;
  }

  beat(square) {
    square.firstChild.remove();
    points.incresePlayerPoints(this.enemyPiece.type);
  }

  preventPawnColision(pieceColor, cords, piece) {
    const firstMove = piece.dataset.firstmove;

    if (firstMove == "true") {

      if (pieceColor == "white") {
        const collidingObjectWhite = chessboard.squaresArray.find((e) => e.dataset.mark == `${cords[0]}${parseInt(cords[1]) + 1}`);

        if (collidingObjectWhite.hasChildNodes()) return true;

      } 
      else if (pieceColor == "black") {
        const collidingObjectBlack = chessboard.squaresArray.find((e) => e.dataset.mark == `${cords[0]}${parseInt(cords[1]) - 1}`);

        if (collidingObjectBlack.hasChildNodes()) return true;
      }
    }
  }

  preventRookColision(cords, squareCords, cordsIndex) {
    const colMove = parseInt(this.cordsArray.indexOf(squareCords[0])) == cordsIndex;
    const rowMove = squareCords[1] == cords[1];

    const squaresToCheck = [];

    if (colMove) {
      const top = parseInt(squareCords[1]) > parseInt(cords[1]);
      const bottom = parseInt(squareCords[1]) < parseInt(cords[1]);

      if (top) {
        const suspectedSquaresCount = parseInt(squareCords[1]) - parseInt(cords[1]) - 1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;
            if (mark == `${squareCords[0]}${parseInt(cords[1]) + 1 + i}`) {
              squaresToCheck.push(e);
            }});
        }

      } 
      else if (bottom) {
        const suspectedSquaresCount = parseInt(cords[1]) - parseInt(squareCords[1]) - 1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;
            if (mark == `${squareCords[0]}${parseInt(cords[1]) - 1 - i}`) {
              squaresToCheck.push(e);
            }});
        }
      }

    } 
    else if (rowMove) {
      const left = parseInt(this.cordsArray.indexOf(squareCords[0])) < parseInt(this.cordsArray.indexOf(cords[0]));
      const right = parseInt(this.cordsArray.indexOf(squareCords[0])) > parseInt(this.cordsArray.indexOf(cords[0]));

      if (left) {
        const suspectedSquaresCount = parseInt(this.cordsArray.indexOf(cords[0])) - parseInt(this.cordsArray.indexOf(squareCords[0])) - 1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;

            if (mark ==`${this.cordsArray[parseInt(this.cordsArray.indexOf(squareCords[0])) + 1 + i]}${cords[1]}`) {
              squaresToCheck.push(e);
            }});
        }

      } 
      else if (right) {
        const suspectedSquaresCount = parseInt(this.cordsArray.indexOf(squareCords[0])) - parseInt(this.cordsArray.indexOf(cords[0])) - 1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;

            if (mark ==`${this.cordsArray[parseInt(this.cordsArray.indexOf(squareCords[0])) - 1 - i]}${cords[1]}`) {
              squaresToCheck.push(e);
            }});
        }
      }
    }

    const colision = squaresToCheck.find((e) => e.hasChildNodes());
    if (colision) return true;
  }

  preventBishopColision(cords, squareCords, cordsIndex) {
    const squaresToCheck = [];

    const topRight =
      parseInt(this.cordsArray.indexOf(squareCords[0])) > parseInt(this.cordsArray.indexOf(cords[0])) &&
      parseInt(squareCords[1]) > parseInt(cords[1]);

    const topLef = parseInt(this.cordsArray.indexOf(squareCords[0])) < parseInt(this.cordsArray.indexOf(cords[0])) &&
      parseInt(squareCords[1]) > parseInt(cords[1]);

    const BottomRight = parseInt(this.cordsArray.indexOf(squareCords[0])) > parseInt(this.cordsArray.indexOf(cords[0])) &&
      parseInt(squareCords[1]) < parseInt(cords[1]);

    const BottomLeft = parseInt(this.cordsArray.indexOf(squareCords[0])) < parseInt(this.cordsArray.indexOf(cords[0])) &&
      parseInt(squareCords[1]) < parseInt(cords[1]);

    if (topLef) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (this.cordsArray.indexOf(mark[0]) <= this.cordsArray.indexOf(squareCords[0])) return;

          if (mark == `${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) + i}`) {
            squaresToCheck.push(e);
          }});
      }
    }

    if (BottomLeft) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (this.cordsArray.indexOf(mark[0]) <= this.cordsArray.indexOf(squareCords[0])) return;

          if (mark == `${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) - i}`) {
            squaresToCheck.push(e);
          }});
      }
    }
    if (topRight) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (this.cordsArray.indexOf(mark[0]) >= this.cordsArray.indexOf(squareCords[0]))return;

          if (mark ==`${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) + i}`) {
            squaresToCheck.push(e);
          }});
      }
    }
    if (BottomRight) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (this.cordsArray.indexOf(mark[0]) >= this.cordsArray.indexOf(squareCords[0])) return;

          if (mark == `${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`) {
            squaresToCheck.push(e);
          }});
      }
    }

    const colision = squaresToCheck.find((e) => e.hasChildNodes());
    if (colision) return true;
  }

  preventQueenColision(cords, squareCords, cordsIndex) {
    if (
      this.preventRookColision(cords, squareCords, cordsIndex) ||
      this.preventBishopColision(cords, squareCords, cordsIndex)
    )
      return true;
  }

  checkCanCastle(piece, pieceColor, squareCords, cords, cordsIndex){

    if (piece.dataset.firstmove == "true") {

      if (pieceColor == "white") {
        if (squareCords == "g1") {
          if (this.preventRookColision(cords, squareCords, cordsIndex)) return;
          else return true;
        } else if (squareCords == "c1") {
          if (this.preventRookColision(cords, squareCords, cordsIndex)) return;
          else return true;
        }
      }

      if (pieceColor == "black") {
        if (squareCords == "g8") {
          if (this.preventRookColision(cords, squareCords, cordsIndex)) return;
          else return true;
        } else if (squareCords == "c8") {
          if (this.preventRookColision(cords, squareCords, cordsIndex)) return;
          else return true;
        }
      }
    }
  }

  castle(piece, square, squareCords, pieceType){
    let rookPiece = null;
    let newRookPlace = null
    let newKingPlace = null;
    const castled = true;

    if (squareCords == "g1") {
      rookPiece = chessboard.squaresArray.find(e => e.dataset.mark == "h1").firstChild;
      newRookPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "f1");
      newKingPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "g1");
    } 
    else if (squareCords == "c1") {
      rookPiece = chessboard.squaresArray.find(e => e.dataset.mark == "a1").firstChild;
      newRookPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "d1");
      newKingPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "c1");
    } 
    else if (squareCords == "g8") {
      rookPiece = chessboard.squaresArray.find(e => e.dataset.mark == "h8").firstChild;
      newRookPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "f8");
      newKingPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "g8");
    } 
    else if (squareCords == "c8") {
      rookPiece = chessboard.squaresArray.find(e => e.dataset.mark == "a8").firstChild;
      newRookPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "d8");
      newKingPlace = chessboard.squaresArray.find((e) => e.dataset.mark == "c8");
    }

    newRookPlace.appendChild(rookPiece);
    newKingPlace.appendChild(piece);

    this.moved(piece, square, pieceType, castled);
  }

  lookForCheck(){
    const playerColor = game.checkPlayerColor();
    let isDanger = false;

    chessboard.squaresArray.find(e => {
  
        if(playerColor == 'white'){
          if(e.firstChild != null && e.firstChild.dataset.piececolor == 'white' && e.firstChild.dataset.piecetype == 'king'){
            if(e.dataset.lock_for_white == 'true'){
              this.check = true;
              e.classList.add('danger');
              isDanger = true;
            }
          }
        }
        else if(playerColor == 'black'){
          if(e.firstChild != null && e.firstChild.dataset.piececolor == 'black' && e.firstChild.dataset.piecetype == 'king'){
            if(e.dataset.lock_for_black == 'true'){
              this.check = true;
              e.classList.add('danger');
              isDanger = true;
            }
        }
      }
    });

    if(isDanger) return true;
  }

  checkIsSafe(piece, square) {
    const currentSquare = piece.parentNode;

    square.appendChild(piece);
    chessboard.clearLock();
    chessboard.lockSquare();

    if(this.lookForCheck()) {
      currentSquare.appendChild(piece);
      return false;
    }
    else{
      this.check = false;
      chessboard.squaresArray.forEach(e => e.classList.remove('danger'));
      currentSquare.appendChild(piece);
      return true;
    }
  }

  checkCanMove(piece, square, pieceType) {
    const cords = this.selectedPiece.parentNode.dataset.mark;
    let cordsIndex = this.cordsArray.indexOf(cords[0]);

    const squareCords = square.dataset.mark;
    const pieceColor = piece.dataset.piececolor;

    if (game.playerMoveSwitch == true && pieceColor == "black") return;
    if (game.playerMoveSwitch == false && pieceColor == "white") return;

    if (pieceType == "pawn") {
      if (this.preventSameMove(cords, squareCords)) return;
      if (this.pawnMoveRules(piece, cords, squareCords, pieceColor, square, cordsIndex)) {
        if (this.preventPawnColision(pieceColor, cords, piece)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } 
    else if (pieceType == "rook") {
      if (this.preventSameMove(cords, squareCords)) return;
      if (this.rookMoveRules(cords, squareCords)) {
        if (this.preventRookColision(cords, squareCords, cordsIndex)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } 
    else if (pieceType == "knight") {
      if (this.preventSameMove(cords, squareCords)) return;
      if (this.knightMoveRules(cords, squareCords, cordsIndex)) {
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } 
    else if (pieceType == "king") {
      if (this.preventSameMove(cords, squareCords)) return;
      if (this.checkCanCastle(piece, pieceColor, squareCords, cords, cordsIndex))
      this.castle(piece, square, squareCords, pieceType);
      else if (this.kingMoveRules(cords, squareCords, cordsIndex)) {
        if (this.preventFriendlyFire(square)) return;
        if (this.preventWrongSquareMove(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } 
    else if (pieceType == "bishop") {
      if (this.preventSameMove(cords, squareCords)) return;
      if (this.bishopMoveRules(cords, squareCords, cordsIndex)) {
        if (this.preventBishopColision(cords, squareCords, cordsIndex)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } 
    else if (pieceType == "queen") {
      if (this.preventSameMove(cords, squareCords)) return;
      if (this.queenMoveRules(cords, squareCords, cordsIndex)) {
        if (this.preventQueenColision(cords, squareCords, cordsIndex)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } 
  }

  moved(piece, square, pieceType, castled) {

    if(!this.checkIsSafe(piece, square)) return;

    this.moveCount++;
    if (this.moveCount % 2 == 0) this.tourCount++;

    piece.dataset.firstmove = "false";

    game.playerMoveSwitch = !game.playerMoveSwitch;

    if(!castled) square.appendChild(piece);
    
    moveList.drawMove(square, pieceType);
    
    timer.timerStart();
    
    chessboard.rotate();

    chessboard.clearLock();
    chessboard.lockSquare();
    
    this.clearSelect();

    this.lookForCheck();
  }
}

export const move = new Move();