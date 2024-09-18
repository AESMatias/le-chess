import { Coords } from './Types.tsx';
import {MovementIsValid} from './MovementIsValid.tsx';

type PieceWithCoords = {
  piece: string;
  position: Coords;
}

type returnedObject = {
  inDanger: boolean;
  currentDangerPiecesLineal: PieceWithCoords[];
  currentDangerPicesDiagonal: PieceWithCoords[];
  currentKnightPathPieces: PieceWithCoords[];
}

export const isInDanger = (board: string[][], pieceId:string, currentPosition: Coords):returnedObject => {

    let inDanger = false;
    const currentRow = currentPosition['row'];
    const currentCol = currentPosition['col'];
    const currentDangerPiecesLineal: PieceWithCoords[] = [];
    const currentDangerPicesDiagonal: PieceWithCoords[] = [];
    const currentKnightPathPieces: PieceWithCoords[] = [];
    const pieceColor = pieceId.split('_')[0];

    //TODO: Check the pieces don't go out of the board!
    const recursivePathCheckVertical = (currentPosition:Coords, direction:number) => {
      const currentRow = currentPosition['row'];
      const currentCol = currentPosition['col'];

      if ((currentRow+direction < 0 || currentRow+direction > 7) || (currentCol < 0 || currentCol > 7)) {
        return false
      }


      const currentDangerousPiece = board[currentRow+direction][currentCol]

      if (currentDangerousPiece.split('_')[0] === pieceColor){
        return false
      }

      if (currentDangerousPiece !== '') {

        const isValid = MovementIsValid(board, currentDangerousPiece,
          {row: currentRow+direction, col: currentCol},
          currentPosition
        )

        if (!isValid) {
          return true
        }

        currentDangerPiecesLineal.push({
          piece:currentDangerousPiece,
          position:{row:currentRow+direction, col:currentCol}
         })

        return true;
      }

      if (currentDangerousPiece === '') {
        return recursivePathCheckVertical(
          { row: currentRow+direction, col: currentCol }, direction)
      }

      return false
    }


    const recursivePathCheckHorizontal = (currentPosition:Coords, direction:number) => {
      const currentRow = currentPosition['row'];
      const currentCol = currentPosition['col'];

      if ((currentRow < 0 || currentRow > 7) || (currentCol+direction < 0 || currentCol+direction > 7)) {
        return false
      }

      const currentDangerousPiece = board[currentRow][currentCol+direction]

      if (currentDangerousPiece.split('_')[0] === pieceColor){
        return false
      }

      if (currentDangerousPiece !== '') {

        const isValid = MovementIsValid(board, currentDangerousPiece,
          {row: currentRow, col: currentCol+direction},
          currentPosition
        )

        if (!isValid) {
          return true
        }

        currentDangerPiecesLineal.push({
          piece:currentDangerousPiece,
          position:{row:currentRow, col:currentCol+direction}
         })
         
        return true;
      }

      if (currentDangerousPiece === '') {
        return recursivePathCheckHorizontal(
          { row: currentRow, col: currentCol+direction }, direction)
      }
      return false
    }


    const recursivePathCheckDiagonal = (currentPosition:Coords, directionRow:number, directionCol:number) => {
     const currentRow = currentPosition['row'];
     const currentCol = currentPosition['col'];
     //TODO: Refactor the currentDangerousPiece in every recursive function

      //TODO: Check the pieces don't go out of the board in the server, very important!
      if ((currentRow+directionRow < 0 || currentRow+directionRow > 7) || 
      (currentCol+directionCol < 0 || currentCol+directionCol > 7)) {
        return false
      }
      const currentDangerousPiece = board[currentRow+directionRow][currentCol+directionCol]

    
      if (currentDangerousPiece.split('_')[0] === pieceColor){
        return false
      }

      if (currentDangerousPiece !== '') {
        
        const isValid = MovementIsValid(board, currentDangerousPiece,
          {row: currentRow+directionRow, col: currentCol+directionCol},
          currentPosition
        )

        // if (isValid) {

          // if(currentDangerousPiece.split('_')[1] === 'Bishop') {
            console.log('se agregooooo ', currentDangerousPiece, 
              'en la posicion', {row: currentRow+directionRow, col: currentCol+directionCol},
            'luego de revisar la posicion', currentPosition)
          // }


          currentDangerPicesDiagonal.push({
            piece:currentDangerousPiece,
            position:{ row:currentRow+directionRow, col:currentCol+directionCol}
           })
        // }

        return true;
      }

     if (board[currentRow + directionRow][currentCol + directionCol] === '') {
       return recursivePathCheckDiagonal(
         { row: currentRow+directionRow, col: currentCol+directionCol },
          directionRow, directionCol)
     }

     return false
   }


   const recursiveKnightCheck = (currentPosition:Coords, directionRow:number, directionCol:number) => {
    //TODO: This func is not recursive, i need to rename it
    const currentRow = currentPosition['row'];
    const currentCol = currentPosition['col'];

      if ((currentRow+directionRow < 0 || currentRow+directionRow > 7) || 
      (currentCol+directionCol < 0 || currentCol+directionCol > 7)) {
        return false
      }

      const currentDangerousPiece = board[currentRow+directionRow][currentCol+directionCol]

      if (currentDangerousPiece.split('_')[0] === pieceColor){
        return false
      }

      if (currentDangerousPiece !== '') {

        const isValid = MovementIsValid(board, currentDangerousPiece,
          {row: currentRow+directionRow, col: currentCol+directionCol},
          currentPosition
        )

        if (!isValid) {
          return true
        }

        currentKnightPathPieces.push({
          piece:currentDangerousPiece,
          position:{ row:currentRow+directionRow, col:currentCol+directionCol}
         })

         return true
        }
      return false

  }

    
    const downVerticalPiece = recursivePathCheckVertical({row: currentRow , col: currentCol}, 1)
    const upVerticalPiece = recursivePathCheckVertical({row: currentRow , col: currentCol}, -1)
    const rightHorizontalPiece = recursivePathCheckHorizontal({row: currentRow , col: currentCol}, 1)
    const leftHorizontalPiece = recursivePathCheckHorizontal({row: currentRow , col: currentCol}, -1)

    const directionVerticalRight = recursivePathCheckDiagonal({row: currentRow , col: currentCol}, -1, 1);
    const directionVerticalLeft = recursivePathCheckDiagonal({row: currentRow , col: currentCol}, -1, -1);
    const directionHorizontalRight = recursivePathCheckDiagonal({row: currentRow , col: currentCol}, 1, 1);
    const directionHorizontalLeft = recursivePathCheckDiagonal({row: currentRow , col: currentCol}, 1, -1);

    const knightPathUpRight = recursiveKnightCheck({row: currentRow, col: currentCol}, 2, 1);
    const knightPathUpLeft = recursiveKnightCheck({row: currentRow, col: currentCol}, 2, -1);
    const knightPathDownRight = recursiveKnightCheck({row: currentRow, col: currentCol}, -2, 1);
    const knightPathDownLeft = recursiveKnightCheck({row: currentRow, col: currentCol}, -2, -1);

    const knightSecondPathUpRight = recursiveKnightCheck({row: currentRow, col: currentCol}, 1, 2);
    const knightSecondPathUpLeft = recursiveKnightCheck({row: currentRow, col: currentCol}, 1, -2);
    const knightSecondPathDownRight = recursiveKnightCheck({row: currentRow, col: currentCol}, -1, 2);
    const knightSecondPathDownLeft = recursiveKnightCheck({row: currentRow, col: currentCol}, -1, -2);


    if (downVerticalPiece || upVerticalPiece || rightHorizontalPiece || leftHorizontalPiece) {

      currentDangerPiecesLineal.forEach(piece => {

        if (piece.piece.split('_')[1] === 'King' 
        && (Math.abs(currentRow - piece.position.row) === 1 || Math.abs(currentCol - piece.position.col) === 1)) {
          inDanger = true;
        }

        if (piece.piece.split('_')[1] === 'Queen') {
          inDanger = true;
        }

        if (piece.piece.split('_')[1] === 'Rook') {
          inDanger = true;
        }
      })
    }        

    if (directionVerticalRight || directionVerticalLeft || directionHorizontalRight || directionHorizontalLeft) {

      currentDangerPicesDiagonal.forEach(piece => {

        if (piece.piece.split('_')[1] === 'Queen') {
          inDanger = true;
        }

        if (piece.piece.split('_')[1] === 'Bishop') {
          inDanger = true;
        }

        if (piece.piece.split('_')[1] === 'King' 
        && (Math.abs(currentRow - piece.position.row) === 1) 
        && (Math.abs(currentCol - piece.position.col) === 1)) {
          inDanger = true;
        }

        if (piece.piece === 'Black_Pawn' && (currentRow - piece.position.row === -1)) {
          inDanger = true;
        }

        if (piece.piece === 'White_Pawn' && (currentRow - piece.position.row === 1)) {
          inDanger = true;
        }
      })
    }

    if (knightPathUpRight || knightPathUpLeft || knightPathDownRight || knightPathDownLeft
      || knightSecondPathUpRight || knightSecondPathUpLeft || knightSecondPathDownRight || knightSecondPathDownLeft) {

      currentKnightPathPieces.forEach(piece => {
        if (piece.piece.split('_')[1] === 'Knight') {
          inDanger = true;
        }
      })
    }

  return (
    { inDanger, currentDangerPiecesLineal, currentDangerPicesDiagonal, currentKnightPathPieces }
  )
}

export default isInDanger;