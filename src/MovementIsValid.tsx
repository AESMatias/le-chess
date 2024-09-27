import { caseCastling } from './caseCastling.tsx';
import {isAimSameColorPieces} from './isAimSameColorPieces.tsx';
import { Coords } from './Types.tsx';

interface returnedObject {
  isValid: boolean;
  castlingEvent: boolean;
} 
export const MovementIsValid = (board: string[][], pieceId:string, currentPosition: Coords,
   toPosition: Coords, sendRequestMove:any, draggedPiece:any) :returnedObject => {


    let isValid = false;
    let castlingEvent = false;
    const currentRow = currentPosition['row'];
    const currentCol = currentPosition['col'];
    const toRow = toPosition['row'];
    const toCol = toPosition['col'];

    const pieceType = pieceId.split('_')[1];
    // const pieceColor = pieceId.split('_')[0];
    // const aimPieceColor = board[toRow][toCol].split('_')[0];

    //TODO: Check the pieces don't go out of the board in the server!
    if (toCol < 0 || toCol > 7 || toRow < 0 || toRow > 7) {
      console.log("Invalid movement, out of the board")
      isValid = false
      return {isValid, castlingEvent}
    }

    const recursivePathCheckVertical = (currentPosition:Coords, toPosition:Coords, direction:number) => {
      const currentRow = currentPosition['row'];
      const currentCol = currentPosition['col'];
      const toRow = toPosition['row'];
      const toCol = toPosition['col'];

      if (currentRow === toRow && currentCol === toCol) {
        return true
      }

      if (board[currentRow][currentCol] === '') {
        return recursivePathCheckVertical(
          { row: currentRow+direction, col: currentCol },
           toPosition, direction)
      }
      return false
    }

    const recursivePathCheckHorizontal = (currentPosition:  Coords, toPosition:Coords, direction:number) => {

      const currentRow = currentPosition['row'];
      const currentCol = currentPosition['col'];
      const toRow = toPosition['row'];
      const toCol = toPosition['col'];

      if (currentRow === toRow && currentCol === toCol) {

        return true


    }

      if (board[currentRow][currentCol] === '') {
        return recursivePathCheckHorizontal(
          { row: currentRow, col: currentCol+direction },
           toPosition, direction)
      }
      return false
    }

    const recursivePathCheckDiagonal = (currentPosition:Coords, toPosition:Coords,
       directionRow:number, directionCol:number) => {
      const currentRow = currentPosition['row'];
      const currentCol = currentPosition['col'];
      const toRow = toPosition['row'];
      const toCol = toPosition['col'];

      if (currentRow === toRow && currentCol === toCol) {
        return true
      }

      if (board[currentRow][currentCol] === '') {
        return recursivePathCheckDiagonal(
          { row: currentRow+directionRow, col: currentCol+directionCol },
           toPosition, directionRow, directionCol)
      }
      
      return false
    }

  const isAimSameColor = isAimSameColorPieces(board, currentPosition, toPosition)

  if (pieceType === 'King') {

    const isCastling = caseCastling(board, pieceId, currentPosition, toPosition, sendRequestMove, draggedPiece);


    if (isCastling) {
      isValid = true
      castlingEvent = true
    }

    if ((toRow === currentRow + 1 || toRow === currentRow - 1) && toCol === currentCol && !isAimSameColor) {
      isValid = true
    }
    if ((toCol === currentCol + 1 || toCol === currentCol - 1) && toRow === currentRow && !isAimSameColor) {
      isValid = true
    }
    if (toRow === currentRow + 1 && (toCol === currentCol + 1 || toCol === currentCol - 1) && !isAimSameColor) {
      isValid = true
    }
    if (toRow === currentRow - 1 && (toCol === currentCol + 1 || toCol === currentCol - 1) && !isAimSameColor) {
      isValid = true
    }

  }

  if (isAimSameColor && pieceType !== 'King') {
    console.log("Invalid movement, the target piece is the same color as the current piece")
    isValid = false
    return {isValid, castlingEvent}
  } 
  //TODO: DELETE THE && !isAimSameColor in the following if statements

  
  else if (pieceId === 'White_Pawn' && !isAimSameColor) {
    if (toRow === currentRow + 1 && toCol === currentCol) {
      isValid = board[toRow][toCol] !== '' ? false : true
    }
    if (toRow === currentRow + 1 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      isValid = board[toRow][toCol] !== '' ? true : false
    }
    // First pawn movement case: can be moved one or two steps ahead.
    if ( (toRow === currentRow + 1 || toRow === currentRow + 2) 
      && toCol === currentCol
      && ((currentRow == 1) && (toRow == 3)) ){
      isValid = board[toRow][toCol] !== '' ? false : true
    }
  }

  else if (pieceId === 'Black_Pawn' && !isAimSameColor) {
    if (toRow === currentRow - 1 && toCol === currentCol) {
      isValid = board[toRow][toCol] !== '' ? false : true
    }
    if (toRow === currentRow - 1 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      isValid = board[toRow][toCol] !== '' ? true : false
    }
    if ((toRow === currentRow - 1 || toRow === currentRow - 2 )
      && toCol === currentCol
      && ((currentRow == 6) && (toRow == 4)) ){
      isValid = board[toRow][toCol] !== '' ? false : true
    }
  }

  else if (pieceType === 'Queen' && !isAimSameColor) {
    const directionVertical = currentRow < toRow ? +1 : -1;
    const directionHorizontal = currentCol < toCol ? +1 : -1;
    const diagonalDirectionRow = currentRow < toRow ? +1 : -1;
    const diagonalDirectionCol = currentCol < toCol ? +1 : -1;
    // let isValid = false;

    if (currentRow === toRow) {
      isValid = recursivePathCheckHorizontal({row:currentRow, col:currentCol + directionHorizontal}, toPosition, directionHorizontal)
    }
    if (currentCol === toCol) {
      isValid = recursivePathCheckVertical({row:currentRow + directionVertical, col:currentCol}, toPosition, directionVertical)
    }
    if (Math.abs(currentRow - toRow) === Math.abs(currentCol - toCol)) {
      isValid = recursivePathCheckDiagonal({row:currentRow + diagonalDirectionRow, col:currentCol + diagonalDirectionCol},
         toPosition, diagonalDirectionRow, diagonalDirectionCol)
    }

    // return isValid
  }

  else if (pieceType === 'Bishop' && !isAimSameColor) {
    const diagonalDirectionRow = currentRow < toRow ? +1 : -1;
    const diagonalDirectionCol = currentCol < toCol ? +1 : -1;
    // let isValid = false;

    if (Math.abs(currentRow - toRow) === Math.abs(currentCol - toCol)) {
      isValid = recursivePathCheckDiagonal({row:currentRow + diagonalDirectionRow, col:currentCol + diagonalDirectionCol},
         toPosition, diagonalDirectionRow, diagonalDirectionCol)
    }

    // return isValid
  }

  else if (pieceType === 'Rook' && !isAimSameColor) {
    const directionVertical = currentRow < toRow ? +1 : -1;
    const directionHorizontal = currentCol < toCol ? +1 : -1;
    // let isValid = false;

    if (currentRow === toRow) {
      isValid = recursivePathCheckHorizontal({row:currentRow, col:currentCol + directionHorizontal}, toPosition, directionHorizontal)
    }
    if (currentCol === toCol) {
      isValid = recursivePathCheckVertical({row:currentRow + directionVertical, col:currentCol}, toPosition, directionVertical)
    }

    // return isValid
  }

  else if (pieceType === 'Knight' && !isAimSameColor) {
    if (toRow === currentRow + 2 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      isValid = true
    }
    if (toRow === currentRow - 2 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      isValid = true
    }
    if (toCol === currentCol + 2 && (toRow === currentRow + 1 || toRow === currentRow - 1)) {
      isValid = true
    }
    if (toCol === currentCol - 2 && (toRow === currentRow + 1 || toRow === currentRow - 1)) {
      isValid = true
    }
  }
  
  return (
    {isValid, castlingEvent}
  )
}

export default MovementIsValid;