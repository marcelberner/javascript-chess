import { move } from "./move.js";
import { Pieces, PIECES_ARRAY } from "./pieces.js";
import { game } from "./game.js";

class Chessboard {
  constructor(chessboard, chessboardContainer, cords) {
    this.chessboardContainer = chessboardContainer;
    this.chessboard = chessboard;
    this.cords = cords;

    this.squaresArray = [];

    this.count = 0;
  }

  selectSquareHandler(square) {
    square.addEventListener("click", () => this.selectSquare(square));
  }

  selectSquare(square) {
    if (game.gameIsStarted && !game.gamePaused) {
      if (this.count == 0 && square.hasChildNodes()) {
        move.clearSelect();
        square.classList.add('selected');
        this.selectPieceToMove(square);
      }
      
      if (move.selectedPiece == null) return;
      this.count++;

      if (this.count == 2) {
        const playerColor = game.checkPlayerColor();
        const pieceColor = square.hasChildNodes() ? square.firstChild.dataset.piececolor : '';

        if(playerColor == pieceColor){
          this.selectOtherPiece(square);
        }
        else this.movePieceTo(square);
      }
    }
  }
  
  selectOtherPiece(square) {
    this.count = 0;
    this.selectSquare(square);
  }

  selectPieceToMove(square) {
    const piece = square.firstChild == null ? false : square.firstChild;
    const pieceType = piece.dataset.piecetype;
    move.setSelectedPiece(piece, pieceType);
  }

  movePieceTo(square) {
    this.count = 0;

    this.lookForEnemies(square);
    move.checkCanMove(move.selectedPiece, square, move.pieceType);
  }

  lookForEnemies(square) {
    const playerColor = game.checkPlayerColor();

    if (square.hasChildNodes()) {
      if (square.firstChild.dataset.piececolor != playerColor) {
        move.enemyPiece = {
          piece: square.firstChild,
          type: square.firstChild.dataset.piecetype,
          color: square.firstChild.dataset.piececolor,
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

    PIECES_ARRAY.forEach((e) => e.classList.toggle("rotate"));

    this.cords.forEach((e) => e.classList.toggle("rotate"));
  }

  lockSquare(){
    this.squaresArray.forEach(e=>{
      if(e.hasChildNodes()){
        const pieceType = e.firstChild.dataset.piecetype;
        const pieceColor = e.firstChild.dataset.piececolor;
        const cordsArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
        const cords = e.dataset.mark;
        let cordsIndex = cordsArray.indexOf(cords[0]);

        if(pieceType == 'pawn'){
          this.lockByWhitePawn(cordsArray, cords, cordsIndex, pieceColor);
          this.lockByBlackPawn(cordsArray, cords, cordsIndex, pieceColor);
        }
        else if(pieceType == 'knight'){
          this.lockByKnight(cordsArray, cords, cordsIndex, pieceColor);
        }
        else if(pieceType == 'rook'){  
          this.lockByRook(cordsArray, cords, pieceColor);
        }
        else if(pieceType == 'bishop'){
          this.lockByBishop(cordsArray, cords, cordsIndex, pieceColor);
        }
        else if(pieceType == 'queen'){
          this.lockByBishop(cordsArray, cords, cordsIndex, pieceColor);
          this.lockByRook(cordsArray, cords, pieceColor);
        }
        else if(pieceType == 'king'){
          this.lockByKing(cordsArray, cords, cordsIndex, pieceColor);
        }
      }
    });
  }

  lockByWhitePawn(cordsArray, cords, cordsIndex, pieceColor){

    if(pieceColor != 'white') return;
    
    const squareToLock_1 = this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 1}`)
    const squareToLock_2 = this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 1}`)

    if(squareToLock_1 != undefined) squareToLock_1.dataset.lock_for_black= true;
    if(squareToLock_2 != undefined) squareToLock_2.dataset.lock_for_black = true;
  }

  lockByBlackPawn(cordsArray, cords, cordsIndex, pieceColor){

    if(pieceColor != 'black') return;

    const squareToLock_1 = this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 1}`)
    const squareToLock_2 = this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 1}`)

    if(squareToLock_1 != undefined) squareToLock_1.dataset.lock_for_white= true;
    if(squareToLock_2 != undefined) squareToLock_2.dataset.lock_for_white = true;
  }

  lockByKnight(cordsArray, cords, cordsIndex, pieceColor){
    const squaresToLock = [];

    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 2}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 2}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 2]}${parseInt(cords[1]) - 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 2]}${parseInt(cords[1]) + 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 2]}${parseInt(cords[1]) - 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 2]}${parseInt(cords[1]) + 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 2}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 2}`));

    squaresToLock.forEach(e => {
      if(e != undefined){
        if(pieceColor == 'white') e.dataset.lock_for_black= true;
        if(pieceColor == 'black') e.dataset.lock_for_white= true;
      }
    });
  }

  lockByBishop(cordsArray, cords, cordsIndex, pieceColor){
    let topLeftLoopStoper = false;
    let topRighttLoopStoper = false;
    let bottomLeftLoopStoper = false;
    let bottomRightLoopStoper = false;

    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!topLeftLoopStoper){
          if (mark == cords) continue;
          if (mark == `${cordsArray[cordsIndex - i]}${parseInt(cords[1]) + i}`) {
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) topLeftLoopStoper = true;
          }
        }
      }
    }
  
    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!bottomLeftLoopStoper){
          if (mark == cords) continue;
          if (mark == `${cordsArray[cordsIndex - i]}${parseInt(cords[1]) - i}`) {
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) bottomLeftLoopStoper = true;
          }
        }
      }
    }
  
    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!topRighttLoopStoper){
          if (mark == cords) continue;
          if (mark ==`${cordsArray[cordsIndex + i]}${parseInt(cords[1]) + i}`) {
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) topRighttLoopStoper = true;
          }
        }
      }
    }
  
    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!bottomRightLoopStoper){
          if (mark == cords) continue;
          if (mark == `${cordsArray[cordsIndex + i]}${parseInt(cords[1]) - i}`) {
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) bottomRightLoopStoper = true;
          }
        }
      }
    }
  }

  lockByRook(cordsArray, cords, pieceColor){
    let topLoopStoper = false;
    let leftLoopStoper = false;
    let bottomLoopStoper = false;
    let rightLoopStoper = false;
    
    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!topLoopStoper){
          if (mark == `${cords[0]}${parseInt(cords[1]) + 1 + i}`) { 
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) topLoopStoper = true;
          }
        }
      }
    }
    
    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;
        
        if(!bottomLoopStoper){
          if (mark == `${cords[0]}${parseInt(cords[1]) - 1 - i}`) { 
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) bottomLoopStoper = true;
          }                
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!leftLoopStoper){
          if (mark ==`${cordsArray[parseInt(cordsArray.indexOf(cords[0])) + 1 + i]}${cords[1]}`){ 
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) leftLoopStoper = true;
          }
        }
      }
    }

    for (let i = 0; i < 7; i++) {
      for(let e of this.squaresArray) {
        const mark = e.dataset.mark;

        if(!rightLoopStoper){
          if (mark ==`${cordsArray[parseInt(cordsArray.indexOf(cords[0])) - 1 - i]}${cords[1]}`) { 
            if(pieceColor == 'white') e.dataset.lock_for_black= true;
            if(pieceColor == 'black') e.dataset.lock_for_white= true;
            if(e.hasChildNodes()) rightLoopStoper = true;
          }
        }
      }
    }
      
  }

  lockByKing(cordsArray, cords, cordsIndex, pieceColor){
    const squaresToLock = [];

    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${cords[1]}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${cords[1]}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${parseInt(cords[1]) + 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${parseInt(cords[1]) + 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex]}${parseInt(cords[1]) + 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex - 1]}${parseInt(cords[1]) - 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex + 1]}${parseInt(cords[1]) - 1}`));
    squaresToLock.push(this.squaresArray.find(e=> e.dataset.mark == `${cordsArray[cordsIndex]}${parseInt(cords[1]) - 1}`));

    squaresToLock.forEach(e => {
      if(e != undefined){
        if(pieceColor == 'white') e.dataset.lock_for_black= true;
        if(pieceColor == 'black') e.dataset.lock_for_white= true;
      }
    });
  }

  clearLock(){
    this.squaresArray.forEach(e=>{
      e.dataset.lock_for_white = false;
      e.dataset.lock_for_black = false;
    })
  }

  generateBoard() {
    let letter = null;
    let number = null;
    let flag = true;
    let color = null;

    for (let i = 0; i < 8; i++) {
      for (let j = 8; j >= 1; j--) {
        switch (i) {
          case 0:
            number = "8";
            break;
          case 1:
            number = "7";
            break;
          case 2:
            number = "6";
            break;
          case 3:
            number = "5";
            break;
          case 4:
            number = "4";
            break;
          case 5:
            number = "3";
            break;
          case 6:
            number = "2";
            break;
          case 7:
            number = "1";
            break;
        }

        switch (j) {
          case 8:
            letter = "a";
            break;
          case 7:
            letter = "b";
            break;
          case 6:
            letter = "c";
            break;
          case 5:
            letter = "d";
            break;
          case 4:
            letter = "e";
            break;
          case 3:
            letter = "f";
            break;
          case 2:
            letter = "g";
            break;
          case 1:
            letter = "h";
            break;
        }

        color = flag ? "white" : "black";
        if (j == 1) flag = !flag;

        const mark = `${letter + number}`;

        const square = document.createElement("div");

        square.dataset.mark = mark;
        square.dataset.lock_for_white = false;
        square.dataset.lock_for_black = false;
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

export const chessboard = new Chessboard(
  document.querySelector(".chessboard"),
  document.querySelector(".chessboard-container"),
  document.querySelectorAll(".cord")
);