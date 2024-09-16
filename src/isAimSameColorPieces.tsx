import {Coords} from './Types.tsx'

export const isAimSameColorPieces = (board: string[][], currentPosition:Coords, toPosition:Coords) => {
    let isSameColor = true;
    const currentRow = currentPosition['row'];
    const currentCol = currentPosition['col'];
    const toRow = toPosition['row'];
    const toCol = toPosition['col'];

    const currentPieceColor = board[currentRow][currentCol].split('_')[0];
    const toPieceColor = board[toRow][toCol].split('_')[0];


    isSameColor = (currentPieceColor !== toPieceColor) ? false : true;

    return (isSameColor)
}

export default isAimSameColorPieces;