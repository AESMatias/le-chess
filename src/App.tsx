import { useState, useEffect, DragEvent } from 'react'
import './App.css'
import {svgPieces} from './assets/svgPieces.tsx'
import {MovementIsValid} from './MovementIsValid.tsx'


interface Coords {
  row: number;
  col: number;
  piece: string;
}

function App() {

  const [board, setBoard] = useState<string[][]>([]);
  const [draggedPiece, setDraggedPiece] = useState<Coords>({ row: -1, col: -1, piece: '' });

  const handleDragStart = (e:DragEvent, row: number, col: number) => {
    setDraggedPiece({ row, col, piece: board[row][col] });
    // e.dataTransfer.effectAllowed = "move";
    console.log('draggedPiece', draggedPiece, 'row', row, 'col', col);

  };

  const handleDragOver = (e:DragEvent) => {
    e.preventDefault();
    // console.log('draggedPiece', draggedPiece);
  };

  const handleDrop = (e:DragEvent, row: number, col: number) => {
    e.preventDefault();

    const isValid = MovementIsValid(board, draggedPiece.piece,
       {row: draggedPiece.row, col: draggedPiece.col}, {row, col});

    if (draggedPiece.row === row && draggedPiece.col === col) {
      return;
    }


    if (draggedPiece && isValid) {
      const newBoard = board.slice();
      newBoard[draggedPiece.row][draggedPiece.col] = '';
      newBoard[row][col] = draggedPiece.piece;
      setBoard(newBoard);
      // setDraggedPiece({ row: -1, col: -1, piece: '' });
    }
  };

  const createChessboard = () => {
    const board: string[][] = [];
    for (let row = 0; row < 8; row++) {
      board[row] = [];
      for (let col = 0; col < 8; col++) {
        board[row][col] = ''; 
      }
    }
    return board;
  }
  

  // We se parate the generation of the pieces in two functions, for animation purposes in the near future.
  const generateWhitePieces = (board: string[][]) => {
    board[0][0] = 'White_Rook';
    board[0][1] = 'White_Knight';
    board[0][2] = 'White_Bishop'; 
    board[0][3] = 'White_Queen';
    board[0][4] = 'White_King';
    board[0][5] = 'White_Bishop';
    board[0][6] = 'White_Knight';
    board[0][7] = 'White_Rook';
    for (let col = 0; col < 8; col++) {
      board[1][col] = 'White_Pawn'; 
    }
    return board;
  }

  const generateBlackPieces = (board: string[][]) => {
    board[7][0] = 'Black_Rook';
    board[7][1] = 'Black_Knight';
    board[7][2] = 'Black_Bishop';
    board[7][3] = 'Black_Queen';
    board[7][4] = 'Black_King';
    board[7][5] = 'Black_Bishop';
    board[7][6] = 'Black_Knight';
    board[7][7] = 'Black_Rook';
    for (let col = 0; col < 8; col++) {
      board[6][col] = 'Black_Pawn';
    }
    return board;
  }

  const Piece = (pieceName: string, color: string, row: number, col:number, isRewarded ) => {

    // const [hasBeenRewarded, sethasBeenRewarded] = useState(false);
    const pieceColorShort = color === 'white' ? 'W' : 'B';

    return (
      <div className={`piece_${pieceColorShort}_${pieceName}`}
      draggable
      onDragStart={(e) => handleDragStart(e, row, col)}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e, row, col)}
      style={{cursor: 'pointer'}}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 600 600"
          fill={color} 
          width="45px" 
          height="45px"
        >
          <path d={svgPieces[pieceName]} /> 
        </svg>
      </div>
    )
  }


  // setBoard(generateBlackPieces(generateWhitePieces(emptyBoard)));
  // // setBoard(initialBoardGenerated);  
  // console.log(board);

  useEffect(() => {
    const emptyBoard = createChessboard();
    const initialBoard = generateBlackPieces(generateWhitePieces(emptyBoard));
    setBoard(initialBoard);
    console.log(initialBoard);
  }, []);

  const rowStyle = {
    color: 'white',
    padding: '0px',
    border: '0px solid red',
    display: 'flex',
  };

  const cellStyle = {
    backgroundColor: 'rgba(110, 210, 222,0)',
    padding: '3px',
    border: '1px solid cyan',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      <h1>Le Chess</h1>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}

      {
        
        board.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className={`row_${rowIndex}`} style={rowStyle}>
              {
                row.map((pieceStringName, cellIndex) => {
                  const pieceName = pieceStringName.split('_')[1] && pieceStringName.split('_')[1].toLowerCase();
                  const pieceColor = pieceStringName.split('_')[0] && pieceStringName.split('_')[0].toLowerCase();

                  return (
                    <div key={cellIndex} className={`cell_${cellIndex}`} style={cellStyle}>
                      {Piece(pieceName, pieceColor, rowIndex, cellIndex, false)}
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }


    </>
  )
}

export default App
