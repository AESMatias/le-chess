import { useState, useEffect, DragEvent } from 'react'
import './App.css'
import {svgPieces} from './assets/svgPieces.tsx'
import {MovementIsValid} from './MovementIsValid.tsx'
import isInDanger from './isInDanger.tsx';


interface Coords {
  row: number;
  col: number;
  piece: string;
}

// interface KingStatus {
//   whiteKingStatus: boolean;
//   blackKingStatus: boolean;
// }

interface DangerPiece {
  piece: string;
  position: { row: number; col: number };
}


function App() {

  const [board, setBoard] = useState<string[][]>([]);
  const [draggedPiece, setDraggedPiece] = useState<Coords>({ row: -1, col: -1, piece: '' });
  const [kingWhitePos, setKingWhitePos] = useState<Coords>({ row: 0, col: 4, piece: 'White_King' });
  const [kingBlackPos, setKingBlackPos] = useState<Coords>({ row: 7, col: 4, piece: 'Black_King' });
  const [whoColorAmI, setWhoColorAmI] = useState<string>('White');
  const [whoGoes, setWhoGoes] = useState<string>('White');
  const [stepsCounter, setStepsCounter] = useState<number>(0);
  //TODO: The stepsCounter finishes 1 movement ahead when someone wins, fix it

  useEffect(() => {


    if (stepsCounter === 0) {
      return; //This is to avoid the first render when the board is empty
    }

    const kingBlackRow = kingBlackPos.row;
    const kingBlackCol = kingBlackPos.col;

    const kingWhiteRow = kingWhitePos.row;
    const kingWhiteCol = kingWhitePos.col;

    //TODO: Check if the Kings are in danger after each movement
    const objectKingWhite = isInDanger(board, 'White_King', {row: kingWhiteRow, col: kingWhiteCol});
    const objectKingBlack = isInDanger(board, 'Black_King', {row: kingBlackRow, col: kingBlackCol});

    const checkIsCheckMate = (row:number, col:number, kingColor:string) => {

      console.error('***The King is in danger, let\'s check if it\'s checkmate***');

      const possibleMoves = [
        {row: row+1, col: col},
        {row: row-1, col: col},
        {row: row, col: col+1},
        {row: row, col: col-1},
        {row: row+1, col: col+1},
        {row: row+1, col: col-1},
        {row: row-1, col: col+1},
        {row: row-1, col: col-1},
      ];

      let possibleDangerPieces = [];
      const actualDangerPieces: DangerPiece[] = [];

      if(whoGoes === 'White') {
      possibleDangerPieces = objectKingWhite.currentDangerPiecesLineal
      .concat(objectKingWhite.currentDangerPicesDiagonal)
      .concat(objectKingWhite.currentKnightPathPieces);
      } else {
        possibleDangerPieces = objectKingBlack.currentDangerPiecesLineal
        .concat(objectKingBlack.currentDangerPicesDiagonal)
        .concat(objectKingBlack.currentKnightPathPieces);
      }

      console.error('PossibleDangerPieces', possibleDangerPieces);

      let isCheckMate = true;


      possibleDangerPieces?.forEach((piece) => {
        
        if (kingColor === 'White') {
          const validDanger = MovementIsValid(board, piece.piece, piece.position, kingWhitePos) ? true : false;
          
          if (validDanger) {
            actualDangerPieces.push(piece);
          }

        }

        if (kingColor === 'Black') {
          const validDanger = MovementIsValid(board, piece.piece, piece.position, kingBlackPos) ? true : false;

          if (validDanger) {
            actualDangerPieces.push(piece);
          }

        }
        });



        //TODO: If we check above all the pieces, that for wouldn't be necessary
      for (let i = 0; i < possibleMoves.length; i++) {

        if (possibleMoves[i].row < 0 || possibleMoves[i].row > 7 || possibleMoves[i].col < 0 || possibleMoves[i].col > 7) {
          continue;
        }

        if (!MovementIsValid(board, `${kingColor}_King`, {row, col}, possibleMoves[i])) {
          continue;
        }

        const returnedDanger = isInDanger(board, `${kingColor}_King`, possibleMoves[i]);
        const isDanger = returnedDanger.inDanger;

        if (!isDanger) {
          //We can push to an array the possible moves the king can do in order to scape
          console.error(`The king ${kingColor} would be not in danger if does the movement: `, possibleMoves[i]);
          //Once we have the possible moves, we need to check recursively if these moves are dangerous or not
          isCheckMate = false;
          break;
        }
      }

      
      console.log('ActualDangerPieces', actualDangerPieces);
      // let dangerousPossibleEatablePieces = [];

      const colorPiecesToSearch = kingColor === 'White' ? 'White' : 'Black';

    actualDangerPieces.forEach((actualDangerPiece) => {

        board.forEach((rowArray, row) => {

          rowArray.forEach((piece, col) => {

            console.error(' estamos buscando piezas de color', colorPiecesToSearch);

              if(piece.split('_')[0] === colorPiecesToSearch) {

              //TODO: Refactor this two ifs statements into a more compact one

                const isValid = MovementIsValid(board, piece, {row, col},
                  {row: actualDangerPiece.position.row, col: actualDangerPiece.position.col});

                if (isValid) {
                  // dangerousPossibleEatablePieces.push({piece, position: {row, col}});
                  
                  console.error('HAY UNA SALIDA AL JAQUE EN:::::', piece, {row, col},
                    'que se debe mover hacia', actualDangerPiece.position);

                  isCheckMate = false;

                }

            }

            });

          });

      });


      if (isCheckMate) {
        alert('Checkmate!');
        console.error('CHECKMATE, THE KING LOSER IS', kingColor);
      }
    }


    if (objectKingWhite.inDanger || objectKingBlack.inDanger) {
      alert('Check! The king is in danger');
      checkIsCheckMate(kingWhiteRow, kingWhiteCol, `${whoGoes === 'White' ? 'White' : 'Black'}`);
      // checkIsCheckMate(kingBlackRow, kingBlackCol, 'Black');
    }
  }
  , [whoGoes]);


  const handleDragStart = (e:DragEvent, row: number, col: number) => {
    setDraggedPiece({ row, col, piece: board[row][col] });
    e.dataTransfer.effectAllowed = "move"; //That avoids the green plus sign

  };

  const handleDragOver = (e:DragEvent) => {
    e.preventDefault();
    // console.log('draggedPiece', draggedPiece);
  };

  const handleDrop = (e:DragEvent, row: number, col: number) => {
    e.preventDefault();
    const pieceColor = draggedPiece.piece.split('_')[0];

    const isValid = MovementIsValid(board, draggedPiece.piece,
       {row: draggedPiece.row, col: draggedPiece.col}, {row, col});

    if (draggedPiece.row === row && draggedPiece.col === col) {
      return;
    }


    if (draggedPiece && isValid) {

      let kingBlackRow = kingBlackPos.row;
      let kingBlackCol = kingBlackPos.col;
  
      let kingWhiteRow = kingWhitePos.row;
      let kingWhiteCol = kingWhitePos.col;
  
      let kingWhiteDanger = false;
      let kingBlackDanger = false;

      

      if (whoGoes !== pieceColor) { //TODO: Legitimize to admit the user only moves his pieces
        console.error('You cannot move the other player pieces');
        return;
      }
  
      //We need to update the position of the king after each movement
      if (draggedPiece.piece === 'White_King') {
        kingWhiteRow = row;
        kingWhiteCol = col;
        const returnedDanger = isInDanger(board, 'White_King', {row, col});
        kingWhiteDanger = returnedDanger.inDanger;


        console.error('indanger returns', returnedDanger);
        
        
        if (kingWhiteDanger) {
          console.error('Check! White King in danger');
          return;
        }
        setKingWhitePos({ row, col, piece: 'White_King' }); 
      }
      
      if (draggedPiece.piece === 'Black_King') {
        kingBlackRow = row;
        kingBlackCol = col;
        const returnedDanger = isInDanger(board, 'Black_King', {row, col});
        kingBlackDanger = returnedDanger.inDanger;

        if (kingBlackDanger) {
          console.error('Check! Black King in danger');
          return;
        }
        setKingBlackPos({ row, col, piece: 'Black_King' }); 
      }
    
      if (draggedPiece.piece.split('_')[1] !== 'King') {
      const returnedDangerWhite = isInDanger(board, 'White_King', {row: kingWhiteRow, col: kingWhiteCol});
      const returnedDangerBlack = isInDanger(board, 'Black_King', {row: kingBlackRow, col: kingBlackCol});
      

      kingWhiteDanger = returnedDangerWhite.inDanger;
      kingBlackDanger = returnedDangerBlack.inDanger;
      }


      // // TODO: TODO: Check if there's conflict when the two kings are in danger!
      // if (kingWhiteDanger) {
      //   checkIsCheckMate(kingWhiteRow, kingWhiteCol, 'White');
      // }
      // if (kingBlackDanger) {
      //   checkIsCheckMate(kingBlackRow, kingBlackCol, 'Black');
      // }
      

      
      //Check if the king's are moving to a check position, if so, don't allow the movement and show a message 
      if (kingWhiteDanger && draggedPiece.piece !== 'White_King'
        && draggedPiece.piece.split('_')[0] === 'White') {
        console.error('White King in danger, you cannot MOVE THIS PIECE');
        // kingWhiteDanger = false;
        return;
      }

      if (kingBlackDanger && draggedPiece.piece !== 'Black_King'
        && draggedPiece.piece.split('_')[0] === 'Black') {
          console.error('BLACK King in danger, you cannot MOVE THIS PIECE');
        // kingBlackDanger = false;
        return;
      }

      setWhoGoes(whoGoes === 'White' ? 'Black' : 'White');
      setStepsCounter(stepsCounter + 1);
      const newBoard = board.slice();
      newBoard[draggedPiece.row][draggedPiece.col] = '';
      newBoard[row][col] = draggedPiece.piece;
      setBoard(newBoard);

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
    // TODO: isRewarded should be a component state of the piece, we should change Piece to a functional component

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
      <h3>Current player: {whoGoes}</h3>
      <h3>Steps: {stepsCounter}</h3>
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
