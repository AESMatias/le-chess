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

  else if (pieceType === 'Queen') {
    const directionVertical = currentRow < toRow ? +1 : -1;
    const directionHorizontal = currentCol < toCol ? +1 : -1;
    const diagonalDirectionRow = currentRow < toRow ? +1 : -1;
    const diagonalDirectionCol = currentCol < toCol ? +1 : -1;
    let isValid = false;

    if (currentRow === toRow) {
      isValid = recursivePathCheckHorizontal({row:currentRow, col:currentCol + directionHorizontal}, toPosition, directionHorizontal)
    }
    if (currentCol === toCol) {
      isValid = recursivePathCheckVertical({row:currentRow + directionVertical, col:currentCol}, toPosition, directionVertical)
    }
    if (Math.abs(currentRow - toRow) === Math.abs(currentCol - toCol)) {
      isValid = recursivePathCheckDiagonal({row:currentRow + diagonalDirectionRow, col:currentCol + diagonalDirectionCol}, toPosition, diagonalDirectionRow, diagonalDirectionCol)
    }

    return isValid
  }

  else if (pieceType === 'Bishop') {
    const diagonalDirectionRow = currentRow < toRow ? +1 : -1;
    const diagonalDirectionCol = currentCol < toCol ? +1 : -1;
    let isValid = false;

    if (Math.abs(currentRow - toRow) === Math.abs(currentCol - toCol)) {
      isValid = recursivePathCheckDiagonal({row:currentRow + diagonalDirectionRow, col:currentCol + diagonalDirectionCol}, toPosition, diagonalDirectionRow, diagonalDirectionCol)
    }

    return isValid
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

  else if (pieceType === 'Knight') {
    if (toRow === currentRow + 2 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      return true
    }
    if (toRow === currentRow - 2 && (toCol === currentCol + 1 || toCol === currentCol - 1)) {
      return true
    }
    if (toCol === currentCol + 2 && (toRow === currentRow + 1 || toRow === currentRow - 1)) {
      return true
    }
    if (toCol === currentCol - 2 && (toRow === currentRow + 1 || toRow === currentRow - 1)) {
      return true
    }
  }

  else if (pieceType === 'King') {
    if ((toRow === currentRow + 1 || toRow === currentRow - 1) && toCol === currentCol) {
      return true
    }
    if (toCol === currentCol + 1 && toRow === currentRow) {
      return true
    }
    if (toCol === currentCol - 1 && toRow === currentRow) {
      return true
    }
    if (toRow === currentRow + 1 && toCol === currentCol + 1) {
      return true
    }
    if (toRow === currentRow + 1 && toCol === currentCol - 1) {
      return true
    }
    if (toRow === currentRow - 1 && toCol === currentCol + 1) {
      return true
    }
    if (toRow === currentRow - 1 && toCol === currentCol - 1) {
      return true
    }
  }


  return (
    isValid
  )
}

export default MovementIsValid;