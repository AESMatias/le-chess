import { newRookPosition, newKingPosition } from "./Types";
interface Coords {
    row: number;
    col: number;
}

interface returnedCastlingObject {
    isCastling: boolean;
    newKingPos: newKingPosition;
    newRookPos: newRookPosition;
}

interface RookToMoveType {
    row: number;
    col: number;
    piece: string;
}

export const caseCastling = (board: string[][], pieceId:string, 
    currentPosition: Coords, toPosition: Coords, sendRequestMove:any, draggedPiece):boolean => {

        let isCastling = false
        const pieceColor = pieceId.split('_')[0];
        const pieceType = pieceId.split('_')[1];
        const currentRow = currentPosition['row'];
        const currentCol = currentPosition['col'];
        const toRow = toPosition['row'];
        const toCol = toPosition['col'];
        console.log('moviendooooo', draggedPiece)

        const moveTo = (row: number, col: number, rookObjectToMove: RookToMoveType) => {
            
            // sendRequestMove(row, col, draggedPiece)
            const newBoard = board.slice();
            newBoard[draggedPiece.row][draggedPiece.col] = '';
            newBoard[row][col] = draggedPiece.piece;
            // setBoard(newBoard);
            // sendRequestMove(row, col, draggedPiece);
            // sendRequestMove(rookObjectToMove.row, rookObjectToMove.col, rookObjectToMove.piece);
        }

        //Black castling escenario:
        if (pieceColor === 'Black' && pieceType === 'King' && currentRow === 7 && currentCol === 4) {

            if (toRow === 7 && toCol === 7) {
                if (board[7][7] === 'Black_Rook') {
                    isCastling = true
                    //The isCastling true will be pointing out that the move has been made in this caseCastling.tsx
                    // sendRequestMove(7, 5, draggedPiece)
                }
            }

            if (toRow === 7 && toCol === 0) {
                if (board[7][0] === 'Black_Rook') {
                    isCastling = true
                    //The isCastling true will be pointing out that the move has been made in this caseCastling.tsx
                    // sendRequestMove(7, 3, draggedPiece)
                }
            }
        }
        
        //White castling escenario:


        if (pieceColor === 'White' && pieceType === 'King' && currentRow === 0 && currentCol === 4) {

            if (toRow === 0 && toCol === 7) {
                if (board[0][7] === 'White_Rook') {
                    isCastling = true
                    //The isCastling true will be pointing out that the move has been made in this caseCastling.tsx
                    // sendRequestMove(0, 5, draggedPiece)
                }
            }

            if (toRow === 0 && toCol === 0) {
                console.log('aaa', board[7][0])
                if (board[0][0] === 'White_Rook') {
                    isCastling = true
                    console.error('pieceid', pieceId)
                    const rookObjectToMove = {
                        row: 0,
                        col: 3,
                        piece: 'White_Rook'
                    }
                    //The isCastling true will be pointing out that the move has been made in this caseCastling.tsx
                    // moveTo(0, 3, rookObjectToMove)
                }
            }
        }

        return isCastling
    }

    