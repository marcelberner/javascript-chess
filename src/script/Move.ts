import { timer } from "./Timer";
import { moveList } from "./MoveList";
import { game } from "./Game";
import { points } from "./Points";
import { chessboard } from "./Chessboard";
import { Pieces } from "./Pieces";

class Move {
  cordsArray: string[];
  selectedPiece: HTMLDivElement | null;
  enemyPiece: {
    piece: HTMLDivElement;
    type: string;
    color: string;
    square: HTMLDivElement;
  } | null;
  pieceType: string | null;
  moveCount: number;
  tourCount: number;
  check: boolean;

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
    chessboard.squaresArray.forEach((e) => e.classList.remove("selected"));
  }
  
  setSelectedPiece(piece: HTMLDivElement, type: string) {
    this.selectedPiece = piece;
    this.pieceType = type;
  }
  
  preventSameMove(cords: string, squareCords: string) {
    if (cords == squareCords) return true;
    else return false;
  }
  
  preventFriendlyFire(square: HTMLDivElement) {
    const playerColor = game.checkPlayerColor();
    
    const pieceToBeatColor = square.hasChildNodes()
    ? (square.firstChild as HTMLDivElement).dataset.piececolor
    : "";
    
    if (pieceToBeatColor == playerColor) return true;
    else return false;
  }
  
  preventWrongSquareMove(square: HTMLDivElement) {
    const playerColor = game.checkPlayerColor();
    const squareLockWhite = square.dataset.lock_for_white;
    const squareLockBlack = square.dataset.lock_for_black;
    
    if (playerColor == "white" && squareLockWhite == "true") return true;
    else if (playerColor == "black" && squareLockBlack == "true") return true;
    else return false;
  }

  getPawnMoveset(cords : string, cordsIndex : number, pieceColor : string) {

    const moveset : {
      doubleMove : string;
      singleMove : string;
      attackLeft : string | boolean;
      attackRight : string | boolean;
    } = {
    doubleMove: `${cords![0]}${parseInt(cords![1]) + (pieceColor == "white" ? 2 : -2)}`,
    singleMove: `${cords![0]}${parseInt(cords![1]) + (pieceColor == "white" ? 1 : -1)}`,
    attackLeft: `${this.cordsArray[cordsIndex - 1]}${parseInt(cords![1]) + (pieceColor == "white" ? 1 : -1)}`,
    attackRight: `${this.cordsArray[cordsIndex + 1]}${parseInt(cords![1]) + (pieceColor == "white" ? 1 : -1)}`}

    if(!this.cordsArray[cordsIndex - 1]) moveset.attackLeft = false;
    if(!this.cordsArray[cordsIndex + 1]) moveset.attackRight = false;

    return moveset;
  }
  
  pawnPromote(square: HTMLDivElement) {
    const playerColor = game.checkPlayerColor();
    const newPiece = new Pieces(square);

    const pieceElement = newPiece.appendPiece(`${playerColor}_queen`);

    const pieceType = pieceElement.dataset.piecetype;
    
    if (playerColor == "black") pieceElement.classList.add("rotate");
    
    this.beat(square);
    this.moved(pieceElement, square, pieceType!);
  }
  
  pawnMoveRules(
    piece: HTMLDivElement,
    cords: string,
    squareCords: string,
    pieceColor: string,
    square: HTMLDivElement,
    cordsIndex: number
  ) {
    const firstMove = piece.dataset.firstmove;
    const canBeat = square.hasChildNodes();

    const pawnMoveset = this.getPawnMoveset(cords, cordsIndex, pieceColor)

    const canLastSquare = squareCords[1] == (pieceColor == "white" ? "8" : "1");
    const canDoubleMove = squareCords == pawnMoveset.doubleMove && !canBeat;
    const canSingleMove = squareCords == pawnMoveset.singleMove && !canBeat;
    const canAttack = canBeat && (squareCords == pawnMoveset.attackLeft || squareCords == pawnMoveset.attackRight);
    const canPromote = (canSingleMove && canLastSquare) || (canAttack && canLastSquare);

      if (firstMove == "true" && canDoubleMove) return true;
      else if (canPromote) {
        piece.remove();
        this.pawnPromote(square);
        return false;
      } 
      else if (canAttack) return true;
      else if (canSingleMove) return true;
      else return false;
  }

  rookMoveRules(cords: string, squareCords: string) {
    if (squareCords.includes(cords[0]) || squareCords.includes(cords[1]))
      return true;
    else return false;
  }

  getKnightMoveset(cords : string, cordsIndex : number) {
    const moveset = [
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 2}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 2}`,
      `${this.cordsArray[cordsIndex - 2]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex - 2]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex + 2]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex + 2]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 2}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 2}`,
    ];

    const correctMoveset = moveset.map(cord => cord.length > 2 ? false : cord);

    return correctMoveset
  }

  knightMoveRules(cords: string, squareCords: string, cordsIndex: number) {
    const knightMoveset = this.getKnightMoveset(cords, cordsIndex)
    if (
      squareCords == knightMoveset[0] ||
      squareCords == knightMoveset[1] ||
      squareCords == knightMoveset[2] ||
      squareCords == knightMoveset[3] ||
      squareCords == knightMoveset[4] ||
      squareCords == knightMoveset[5] ||
      squareCords == knightMoveset[6] ||
      squareCords == knightMoveset[7]
    )
      return true;
    else return false;
  }

  bishopMoveRules(cords: string, squareCords: string, cordsIndex: number) {
    const availableSquares = [];

    for (let i = 0; i < 7; i++) {
      availableSquares.push(
        `${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) + i}`
      );
      availableSquares.push(
        `${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) - i}`
      );
      availableSquares.push(
        `${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) + i}`
      );
      availableSquares.push(
        `${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`
      );
    }

    const correctMove = availableSquares.find((e) => e == squareCords);

    if (correctMove) return true;
    else return false;
  }

  getKingMoveset(cords : string, cordsIndex : number) {
    const moveset = [
      `${this.cordsArray[cordsIndex - 1]}${cords[1]}`,
      `${this.cordsArray[cordsIndex + 1]}${cords[1]}`,
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex]}${parseInt(cords[1]) + 1}`,
      `${this.cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 1}`,
      `${this.cordsArray[cordsIndex]}${parseInt(cords[1]) - 1}`,
    ];

    const correctMoveset = moveset.map(cord => cord.length > 2 ? false : cord);

    return correctMoveset;
  }

  kingMoveRules(cords: string, squareCords: string, cordsIndex: number) {
    const kingMoveset = this.getKingMoveset(cords, cordsIndex)

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
    else return false;
  }

  queenMoveRules(cords: string, squareCords: string, cordsIndex: number) {
    if (
      this.bishopMoveRules(cords, squareCords, cordsIndex) ||
      this.rookMoveRules(cords, squareCords)
    )
      return true;
    else return false;
  }

  beat(square: HTMLDivElement) {
    square.firstChild!.remove();
    points.incresePlayerPoints(this.enemyPiece!.type);
  }

  preventPawnColision(
    pieceColor: string,
    cords: string,
    piece: HTMLDivElement,
    cordsIndex : number
  ) {
    const firstMove = piece.dataset.firstmove;
    const pawnMoveset = this.getPawnMoveset(cords, cordsIndex, pieceColor);

    if (firstMove != "true") return;

    const collidingObjectWhite = chessboard.squaresArray.find(e => e.dataset.mark == pawnMoveset.singleMove);

    if (collidingObjectWhite!.hasChildNodes()) return true;
    else return false;
  }

  preventRookColision(
    cords: string,
    squareCords: string,
    cordsIndex: number,
    kingCastle?: boolean
  ) {
    const colMove =
      parseInt(this.cordsArray.indexOf(squareCords[0]) as any) == cordsIndex;
    const rowMove = squareCords[1] == cords[1];

    const squaresToCheck: HTMLDivElement[] = [];

    if (colMove) {
      const top = parseInt(squareCords[1]) > parseInt(cords[1]);
      const bottom = parseInt(squareCords[1]) < parseInt(cords[1]);

      if (top) {
        const suspectedSquaresCount =
          parseInt(squareCords[1]) - parseInt(cords[1]) - 1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;
            if (mark == `${squareCords[0]}${parseInt(cords[1]) + 1 + i}`) {
              squaresToCheck.push(e);
            }
          });
        }
      } else if (bottom) {
        const suspectedSquaresCount =
          parseInt(cords[1]) - parseInt(squareCords[1]) - 1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;
            if (mark == `${squareCords[0]}${parseInt(cords[1]) - 1 - i}`) {
              squaresToCheck.push(e);
            }
          });
        }
      }
    } else if (rowMove) {
      const left =
        parseInt(this.cordsArray.indexOf(squareCords[0]) as any) <
        parseInt(this.cordsArray.indexOf(cords[0]) as any);
      const right =
        parseInt(this.cordsArray.indexOf(squareCords[0]) as any) >
        parseInt(this.cordsArray.indexOf(cords[0]) as any);

      if (left) {
        const suspectedSquaresCount =
          parseInt(this.cordsArray.indexOf(cords[0]) as any) -
          parseInt(this.cordsArray.indexOf(squareCords[0]) as any) -
          1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;

            if (
              mark ==
              `${
                this.cordsArray[
                  parseInt(this.cordsArray.indexOf(squareCords[0]) as any) +
                    1 +
                    i
                ]
              }${cords[1]}`
            ) {
              squaresToCheck.push(e);
            }
          });
        }
      } else if (right) {
        const suspectedSquaresCount =
          parseInt(this.cordsArray.indexOf(squareCords[0]) as any) -
          parseInt(this.cordsArray.indexOf(cords[0]) as any) -
          1;

        for (let i = 0; i < suspectedSquaresCount; i++) {
          chessboard.squaresArray.find((e) => {
            const mark = e.dataset.mark;

            if (
              mark ==
              `${
                this.cordsArray[
                  parseInt(this.cordsArray.indexOf(squareCords[0]) as any) -
                    1 -
                    i
                ]
              }${cords[1]}`
            ) {
              squaresToCheck.push(e);
            }
          });
        }
      }
    }

    const colision = squaresToCheck.find((e) => e.hasChildNodes());
    const kingDanger = squaresToCheck.find((e) =>
      this.preventWrongSquareMove(e)
    );

    if (kingCastle && kingDanger) return true;
    if (colision) return true;
    else return false;
  }

  preventBishopColision(
    cords: string,
    squareCords: string,
    cordsIndex: number
  ) {
    const squaresToCheck: HTMLDivElement[] = [];

    const topRight =
      parseInt(this.cordsArray.indexOf(squareCords[0]) as any) >
        parseInt(this.cordsArray.indexOf(cords[0]) as any) &&
      parseInt(squareCords[1]) > parseInt(cords[1]);

    const topLef =
      parseInt(this.cordsArray.indexOf(squareCords[0]) as any) <
        parseInt(this.cordsArray.indexOf(cords[0]) as any) &&
      parseInt(squareCords[1]) > parseInt(cords[1]);

    const BottomRight =
      parseInt(this.cordsArray.indexOf(squareCords[0]) as any) >
        parseInt(this.cordsArray.indexOf(cords[0]) as any) &&
      parseInt(squareCords[1]) < parseInt(cords[1]);

    const BottomLeft =
      parseInt(this.cordsArray.indexOf(squareCords[0]) as any) <
        parseInt(this.cordsArray.indexOf(cords[0]) as any) &&
      parseInt(squareCords[1]) < parseInt(cords[1]);

    if (topLef) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (
            this.cordsArray.indexOf(mark![0]) <=
            this.cordsArray.indexOf(squareCords[0])
          )
            return;

          if (
            mark ==
            `${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) + i}`
          ) {
            squaresToCheck.push(e);
          }
        });
      }
    }

    if (BottomLeft) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (
            this.cordsArray.indexOf(mark![0]) <=
            this.cordsArray.indexOf(squareCords[0])
          )
            return;

          if (
            mark ==
            `${this.cordsArray[cordsIndex - i]}${parseInt(cords[1]) - i}`
          ) {
            squaresToCheck.push(e);
          }
        });
      }
    }
    if (topRight) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (
            this.cordsArray.indexOf(mark![0]) >=
            this.cordsArray.indexOf(squareCords[0])
          )
            return;

          if (
            mark ==
            `${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) + i}`
          ) {
            squaresToCheck.push(e);
          }
        });
      }
    }
    if (BottomRight) {
      for (let i = 0; i < 7; i++) {
        chessboard.squaresArray.find((e) => {
          const mark = e.dataset.mark;

          if (mark == cords) return;
          if (
            this.cordsArray.indexOf(mark![0]) >=
            this.cordsArray.indexOf(squareCords[0])
          )
            return;

          if (
            mark ==
            `${this.cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`
          ) {
            squaresToCheck.push(e);
          }
        });
      }
    }

    const colision = squaresToCheck.find((e) => e.hasChildNodes());
    if (colision) return true;
    else return false;
  }

  preventQueenColision(cords: string, squareCords: string, cordsIndex: number) {
    if (
      this.preventRookColision(cords, squareCords, cordsIndex) ||
      this.preventBishopColision(cords, squareCords, cordsIndex)
    )
      return true;
    else return false;
  }

  checkCanCastle(
    piece: HTMLDivElement,
    pieceColor: string,
    squareCords: string,
    cords: string,
    cordsIndex: number
  ) {
    const kingCastle = true;

    if (piece.dataset.firstmove == "true") {
      if (pieceColor == "white") {
        if (squareCords == "g1") {
          if (
            this.preventRookColision(cords, squareCords, cordsIndex, kingCastle)
          )
            return false;
          else return true;
        } else if (squareCords == "c1") {
          if (
            this.preventRookColision(cords, squareCords, cordsIndex, kingCastle)
          )
            return false;
          else return true;
        } else return false;
      } else if (pieceColor == "black") {
        if (squareCords == "g8") {
          if (
            this.preventRookColision(cords, squareCords, cordsIndex, kingCastle)
          )
            return false;
          else return true;
        } else if (squareCords == "c8") {
          if (
            this.preventRookColision(cords, squareCords, cordsIndex, kingCastle)
          )
            return false;
          else return true;
        } else return false;
      } else return false;
    } else return false;
  }

  castle(
    piece: HTMLDivElement,
    square: HTMLDivElement,
    squareCords: string,
    pieceType: string
  ) {
    let rookPiece = null;
    let newRookPlace = null;
    let newKingPlace = null;
    const castled = true;

    if (squareCords == "g1") {
      rookPiece = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "h1"
      )!.firstElementChild;
      newRookPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "f1"
      );
      newKingPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "g1"
      );
    } else if (squareCords == "c1") {
      rookPiece = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "a1"
      )!.firstElementChild;
      newRookPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "d1"
      );
      newKingPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "c1"
      );
    } else if (squareCords == "g8") {
      rookPiece = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "h8"
      )!.firstElementChild;
      newRookPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "f8"
      );
      newKingPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "g8"
      );
    } else if (squareCords == "c8") {
      rookPiece = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "a8"
      )!.firstElementChild;
      newRookPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "d8"
      );
      newKingPlace = chessboard.squaresArray.find(
        (e) => e.dataset.mark == "c8"
      );
    }

    newRookPlace!.appendChild(rookPiece!);
    newKingPlace!.appendChild(piece);

    this.moved(piece, square, pieceType, castled);
  }

  lookForCheck() {
    const playerColor = game.checkPlayerColor();
    let isDanger = false;

    chessboard.squaresArray.find((e) => {
      if (playerColor == "white") {
        if (
          e.firstElementChild &&
          (e.firstElementChild as HTMLDivElement).dataset.piececolor ==
            "white" &&
          (e.firstElementChild as HTMLDivElement).dataset.piecetype == "king" &&
          e.dataset.lock_for_white == "true"
        ) {
          this.check = true;
          e.classList.add("danger");
          isDanger = true;
        }
      } else if (playerColor == "black") {
        if (
          e.firstElementChild &&
          (e.firstElementChild as HTMLDivElement).dataset.piececolor ==
            "black" &&
          (e.firstChild as HTMLDivElement).dataset.piecetype == "king" &&
          e.dataset.lock_for_black == "true"
        ) {
          this.check = true;
          e.classList.add("danger");
          isDanger = true;
        }
      }
    });

    if (isDanger) return true;
    else return false;
  }

  checkIsSafe(piece: HTMLDivElement, square: HTMLDivElement) {
    const currentSquare = piece.parentNode;

    square.appendChild(piece);
    chessboard.clearLock();
    chessboard.lockSquare();

    if (this.lookForCheck()) {
      currentSquare!.appendChild(piece);
      return false;
    } else {
      this.check = false;
      chessboard.squaresArray.forEach((e) => e.classList.remove("danger"));
      currentSquare!.appendChild(piece);
      return true;
    }
  }

  checkCanMove(
    piece: HTMLDivElement,
    square: HTMLDivElement,
    pieceType: string
  ) {
    chessboard.takeSnapshot();

    const cords = (this.selectedPiece!.parentNode as HTMLDivElement)!.dataset
      .mark;
    let cordsIndex = this.cordsArray.indexOf(cords![0]);

    const squareCords = square.dataset.mark;
    const pieceColor = piece.dataset.piececolor;

    if (game.playerMoveSwitch == true && pieceColor == "black") return;
    if (game.playerMoveSwitch == false && pieceColor == "white") return;

    if (pieceType == "pawn") {
      if (this.preventSameMove(cords!, squareCords!)) return;
      if (
        this.pawnMoveRules(
          piece,
          cords!,
          squareCords!,
          pieceColor!,
          square,
          cordsIndex
        )
      ) {
        if (this.preventPawnColision(pieceColor!, cords!, piece, cordsIndex)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } else if (pieceType == "rook") {
      if (this.preventSameMove(cords!, squareCords!)) return;
      if (this.rookMoveRules(cords!, squareCords!)) {
        if (this.preventRookColision(cords!, squareCords!, cordsIndex)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } else if (pieceType == "knight") {
      if (this.preventSameMove(cords!, squareCords!)) return;
      if (this.knightMoveRules(cords!, squareCords!, cordsIndex)) {
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } else if (pieceType == "king") {
      if (this.preventSameMove(cords!, squareCords!)) return;
      if (
        this.checkCanCastle(
          piece,
          pieceColor!,
          squareCords!,
          cords!,
          cordsIndex
        )
      )
        this.castle(piece, square, squareCords!, pieceType);
      else if (this.kingMoveRules(cords!, squareCords!, cordsIndex)) {
        if (this.preventFriendlyFire(square)) return;
        if (this.preventWrongSquareMove(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } else if (pieceType == "bishop") {
      if (this.preventSameMove(cords!, squareCords!)) return;
      if (this.bishopMoveRules(cords!, squareCords!, cordsIndex)) {
        if (this.preventBishopColision(cords!, squareCords!, cordsIndex))
          return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    } else if (pieceType == "queen") {
      if (this.preventSameMove(cords!, squareCords!)) return;
      if (this.queenMoveRules(cords!, squareCords!, cordsIndex)) {
        if (this.preventQueenColision(cords!, squareCords!, cordsIndex)) return;
        if (this.preventFriendlyFire(square)) return;
        if (this.enemyPiece) this.beat(square);
        this.moved(piece, square, pieceType);
      }
    }
  }

  moved(
    piece: HTMLDivElement,
    square: HTMLDivElement,
    pieceType: string,
    castled?: boolean
  ) {
    if (!this.checkIsSafe(piece, square)) {
      chessboard.recoverSnapshot();
      return;
    }

    this.moveCount++;
    if (this.moveCount % 2 == 0) this.tourCount++;

    piece.dataset.firstmove = "false";

    game.playerMoveSwitch = !game.playerMoveSwitch;

    if (!castled) square.appendChild(piece);

    moveList.drawMove(square, pieceType);

    timer.timerStart();

    chessboard.rotate();

    chessboard.clearLock();
    chessboard.lockSquare();

    this.clearSelect();

    if (this.lookForCheck()) this.isMate();
  }

  lookForEmptyPlace(kingSquare: HTMLDivElement, enemyColor: string) {
    const cords = kingSquare.dataset.mark!;
    const cordsIndex = this.cordsArray.indexOf(cords![0]);
    let isEmpty = false;

    const kingMoveset = this.getKingMoveset(cords, cordsIndex);

    kingMoveset.forEach((markToCheck) => {
      chessboard.squaresArray.find((square) => {
        if (
          square.dataset.mark == markToCheck &&
          !square.hasChildNodes() &&
          (enemyColor == "black"
            ? square.dataset.lock_for_black == "false"
            : square.dataset.lock_for_white == "false")
        )
          isEmpty = true;
      });
    });

    if (isEmpty) return true;
    else return false;
  }

  canPreventMate(playerColor: string) {
    chessboard.takeSnapshot();
    const protect = true;
    chessboard.squaresArray.forEach((square) => {
      const piece = square.firstElementChild && square.firstElementChild as HTMLDivElement;
      const cords = square.dataset.mark!;
      const cordsIndex = this.cordsArray.indexOf(cords[0]);

      
      if (piece && (piece.dataset.piececolor == (playerColor == "white" ? "white" : "black"))) {
        
        if(piece && piece.dataset.piecetype == "pawn") {

          const pawnMoveset = this.getPawnMoveset(cords, cordsIndex, playerColor)
          const firstMove = piece.dataset.firstmove;

          const leftSquare = chessboard.findSquare(pawnMoveset.attackLeft.toString());
          const rightSquare = chessboard.findSquare(pawnMoveset.attackRight.toString());
          const frontSquare = chessboard.findSquare(pawnMoveset.singleMove);
          const doubleFrontSquare = chessboard.findSquare(pawnMoveset.doubleMove);


          if(frontSquare) frontSquare.appendChild(document.createElement("div"));

          if(doubleFrontSquare && firstMove && !frontSquare!.hasChildNodes()) {
            chessboard.findSquare(pawnMoveset.doubleMove)?.appendChild(document.createElement("div"));
          }
          if(leftSquare && leftSquare.hasChildNodes()){
            leftSquare.firstElementChild && leftSquare.firstElementChild.remove();
            leftSquare.appendChild(document.createElement("div"));
          } 
          if(rightSquare && rightSquare.hasChildNodes()){
            rightSquare.firstElementChild && rightSquare.firstElementChild.remove();
            rightSquare.appendChild(document.createElement("div"));
          } 
          
        }
        else if(piece.dataset.piecetype == "rook") {
          chessboard.lockByRook(this.cordsArray, cords, playerColor, protect);
        }
        else if(piece.dataset.piecetype == "knight") {
          chessboard.lockByKnight(cords, cordsIndex, playerColor, protect); 
        }
        else if(piece.dataset.piecetype == "bishop") {
          chessboard.lockByBishop(this.cordsArray, cords, cordsIndex, playerColor, protect);
        }
        else if(piece.dataset.piecetype == "queen") {
          chessboard.lockByRook(this.cordsArray, cords, playerColor, protect);
          chessboard.lockByBishop(this.cordsArray, cords, cordsIndex, playerColor, protect);
        }
      }
    });

    chessboard.clearLock();
    chessboard.lockSquare();
    const notSafe = this.lookForCheck();

    console.log(notSafe);

    
    if(notSafe) return false
    else {
      chessboard.recoverSnapshot();
      return true
    };
  }

  isMate() {
    const playerColor = game.checkPlayerColor();
    const kingSquare = chessboard.squaresArray.find(
      (square) =>
        square.firstElementChild &&
        (square.firstElementChild as HTMLDivElement).dataset.piecetype ==
          "king" &&
        (square.firstElementChild as HTMLDivElement).dataset.piececolor ==
          playerColor
    );

    const emptyPlace = this.lookForEmptyPlace(kingSquare!, playerColor);
    const canPreventMate = this.canPreventMate(playerColor);

    console.log(emptyPlace, canPreventMate);

    if(!emptyPlace && !canPreventMate) game.endGame();
  }
}

export const move = new Move();
