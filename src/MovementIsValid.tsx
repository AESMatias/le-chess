import {isAimSameColorPieces} from './isAimSameColorPieces.tsx';
import { Coords } from './Types.tsx';

export const MovementIsValid = (board: string[][], pieceId:string, currentPosition: Coords, toPosition: Coords) => {

    //TODO: Check the pieces don't go out of the board!
    let isValid = false;
    const currentRow = currentPosition['row'];
    const currentCol = currentPosition['col'];
    const toRow = toPosition['row'];
    const toCol = toPosition['col'];

    const pieceType = pieceId.split('_')[1];
    // const pieceColor = pieceId.split('_')[0];
    // const aimPieceColor = board[toRow][toCol].split('_')[0];
  

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

      const currentRow = currentPosition.row;
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

    
  if (toCol < 0 || toCol > 8 || toRow < 0 || toRow > 8) {
    console.log("Invalid movement, out of the board")
    return false
  }

  const isAimSameColor = isAimSameColorPieces(board, currentPosition, toPosition)

  if (isAimSameColor) {
    console.log("Invalid movement, the target piece is the same color as the current piece")
    return false
  }

  
  if (pieceId === 'White_Pawn') {
    if (toRow === currentRow + 1 && toCol === currentCol) {
      isValid = board[toRow][toCol] !== '' ? false : true
    }
    if (toRow === currentRow + 1 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      isValid = board[toRow][toCol] !== '' ? true : false
    }
  }

  else if (pieceId === 'Black_Pawn') {
    if (toRow === currentRow - 1 && toCol === currentCol) {
      isValid = board[toRow][toCol] !== '' ? false : true
    }
    if (toRow === currentRow - 1 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      isValid = board[toRow][toCol] !== '' ? true : false
    }
  }





  else if (pieceType === 'Rook') {
    const directionVertical = currentRow < toRow ? +1 : -1;
    const directionHorizontal = currentCol < toCol ? +1 : -1;
    let isValid = false;

    if (currentRow === toRow) {
      isValid = recursivePathCheckHorizontal({row:currentRow, col:currentCol + directionHorizontal}, toPosition, directionHorizontal)
    }
    if (currentCol === toCol) {
      isValid = recursivePathCheckVertical({row:currentRow + directionVertical, col:currentCol}, toPosition, directionVertical)
    }

    return isValid
  }
  return (
    isValid
  )
}

export default MovementIsValid;