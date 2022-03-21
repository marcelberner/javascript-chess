export const PIECES_ARRAY = [];

export class Pieces {
  constructor(square) {
    this.square = square;

    this.firstMove = true;
  }

  appendPiece(pieceType) {
    const type = pieceType.split("_")[1];
    const color = pieceType.split("_")[0];
    const piece = document.createElement("div");

    piece.classList.add("pieces");

    piece.dataset.piecetype = type;
    piece.dataset.piececolor = color;

    if (type == "pawn" || type == "king") piece.dataset.firstmove = "true";
    piece.style.backgroundImage = `url("./images/${pieceType}.svg")`;

    PIECES_ARRAY.push(piece);
    this.square.appendChild(piece);
  }

  createPiece(mark) {
    if (mark == "a1" || mark == "a8" || mark == "h1" || mark == "h8") {
      if (mark == "a1" || mark == "h1") this.appendPiece("white_rook");
      if (mark == "a8" || mark == "h8") this.appendPiece("black_rook");
    } 
    else if (mark.includes("2") || mark.includes("7")) {
      if (mark.includes("2")) this.appendPiece("white_pawn");
      if (mark.includes("7")) this.appendPiece("black_pawn");
    } 
    else if (mark == "b1" || mark == "b8" || mark == "g1" || mark == "g8") {
      if (mark == "b1" || mark == "g1") this.appendPiece("white_knight");
      if (mark == "b8" || mark == "g8") this.appendPiece("black_knight");
    } 
    else if (mark == "c1" || mark == "c8" || mark == "f1" || mark == "f8") {
      if (mark == "c1" || mark == "f1") this.appendPiece("white_bishop");
      if (mark == "c8" || mark == "f8") this.appendPiece("black_bishop");
    } 
    else if (mark == "d1" || mark == "d8") {
      if (mark == "d1") this.appendPiece("white_queen");
      if (mark == "d8") this.appendPiece("black_queen");
    } 
    else if (mark == "e1" || mark == "e8") {
      if (mark == "e1") this.appendPiece("white_king");
      if (mark == "e8") this.appendPiece("black_king");
    } 
    else return;
  }
}
