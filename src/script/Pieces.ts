export class Pieces {
  firstMove?: boolean;
  square: HTMLDivElement;
  pieceType?: string;
  color?: string;

  constructor(
    square: HTMLDivElement,
    firstMove?: boolean,
    pieceType?: string,
    color?: string
  ) {
    this.square = square;
    this.pieceType = pieceType;
    this.color = color;

    this.firstMove = firstMove ? firstMove : true;
  }

  appendPiece(pieceType: string) {
    const type = this.pieceType ? this.pieceType : pieceType.split("_")[1];
    const color = this.color ? this.color : pieceType.split("_")[0];

    const piece = document.createElement("div");

    piece.dataset.piecetype = type;
    piece.dataset.piececolor = color;

    piece.classList.add("pieces");

    if (type == "pawn" || type == "king") piece.dataset.firstmove = `${this.firstMove ? this.firstMove : "true"}`;
    piece.style.backgroundImage = `url("./assets/${pieceType}.svg")`;

    this.square.appendChild(piece);

    return piece;
  }

  createPiece(mark: string) {
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
