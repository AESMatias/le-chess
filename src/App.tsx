import { useState, useEffect, DragEvent } from 'react'
import './App.css'
import {svgPieces} from './assets/svgPieces.tsx'
import {MovementIsValid} from './MovementIsValid.tsx'
import isInDanger from './isInDanger.tsx';
import io from 'socket.io-client';

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

interface movementData {
  piece: string;
  from: { row: number; col: number };
  to: { row: number; col: number };
}

interface actualBoard {
  board: string[][];
}

// const PORT = process.env.PORT || 3000;

function App() {

  const [board, setBoard] = useState<string[][]>([
    ['White_Rook', 'White_Knight', 'White_Bishop', 'White_Queen', 'White_King', 'White_Bishop', 'White_Knight', 'White_Rook'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['Black_Rook', 'Black_Knight', 'Black_Bishop', 'Black_Queen', 'Black_King', 'Black_Bishop', 'Black_Knight', 'Black_Rook']
  ]);
  const [draggedPiece, setDraggedPiece] = useState<Coords>({ row: -1, col: -1, piece: '' });
  const [kingWhitePos, setKingWhitePos] = useState<Coords>({ row: 0, col: 4, piece: 'White_King' });
  const [kingBlackPos, setKingBlackPos] = useState<Coords>({ row: 7, col: 4, piece: 'Black_King' });
  // const [whoColorAmI, setWhoColorAmI] = useState<string>('White');
  const [whoGoes, setWhoGoes] = useState<string>('White');
  const [stepsCounter, setStepsCounter] = useState<number>(-2);
  const [socketData, setSocketData] = useState(0);
  const [boardLoaded, setBoardLoaded] = useState(false);
  const [isCheckMate, setIsCheckMate] = useState(false);
  
  // const [socketMessagesStack , setSocketMessagesStack] = useState<string[]>([]);
  // const socket = io('http://localhost:3000');
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  });
  //TODO: The stepsCounter finishes 1 movement ahead when someone wins, fix it

  // useEffect(() => {
  //   console.log('BOARD HAS BEEN UPDATED FROM THE SERVER');
  // }, [board]);

  const sendRequestMove = (row, col, piece) => {
    if (socket) {
      socket.emit('RequestMove', row, col, piece);
    }

  };

  // const createChessboard = () => {
  //   const board: string[][] = [];

  //   for (let row = 0; row < 8; row++) {
  //     board[row] = [];

  //     for (let col = 0; col < 8; col++) {
  //       board[row][col] = ''; 
  //     }

  //   }
  //   return board;
  // }

  // useEffect(() => {
  //   const emptyBoard = createChessboard();
  //   const initialBoard = generateBlackPieces(generateWhitePieces(emptyBoard));
  //   setBoard(initialBoard);
  //   console.log(initialBoard);
  // }, []);

  useEffect(() => {

    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('currentBoard', (board:string[][], whoGoes:string, isMate:boolean) => {
      setWhoGoes(whoGoes);
      setBoard(board);
      
      setIsCheckMate(isMate);

      console.log('BOARD HAS BEEN UPDATED FROM THE SERVER');
      console.log('whoGoes', whoGoes);
      setStepsCounter(stepsCounter + 1);

      // setSocketMessagesStack((prevMensajes:string[]) => [...prevMensajes, newMessage]);
    });

    socket.on('checkMate', (colorWins: string) => {
      console.error('Winner:', colorWins);
      alert(colorWins);
    });

    // Cleanup
    return () => {
      socket.off('connect');
    };
  }, [boardLoaded]); 

  useEffect(() => {
    if (isCheckMate) {
   alert('CHECKMATE!');
    }

  }, [isCheckMate]); 

  // function generateRandomBoardData(): string[][] {
  //   const pieces = [
  //     'White_Rook', 'White_Knight', 'White_Bishop', 'White_Queen', 'White_King', 'White_Bishop', 'White_Knight', 'White_Rook',
  //     'White_Pawn', 'White_Pawn', 'White_Pawn', 'White_Pawn', 'White_Pawn', 'White_Pawn', 'White_Pawn', 'White_Pawn',
  //     'Black_Rook', 'Black_Knight', 'Black_Bishop', 'Black_Queen', 'Black_King', 'Black_Bishop', 'Black_Knight', 'Black_Rook',
  //     'Black_Pawn', 'Black_Pawn', 'Black_Pawn', 'Black_Pawn', 'Black_Pawn', 'Black_Pawn', 'Black_Pawn', 'Black_Pawn'
  //   ];
  
  //   const board: string[][] = Array(8).fill(null).map(() => Array(8).fill(''));
  
  //   let piecesPlaced = 0;
  //   while (piecesPlaced < 32) {
  //     const randomRow = Math.floor(Math.random() * 8);
  //     const randomCol = Math.floor(Math.random() * 8);
  
  //     if (board[randomRow][randomCol] === '') {
  //       board[randomRow][randomCol] = pieces[piecesPlaced];
  //       piecesPlaced++;
  //     }
  //   }
  
  //   return board;
  // }

  // useEffect(() => {

  //   if (stepsCounter === 0) {
  //     return; //This is to avoid the first render when the board is empty
  //   }

  //   const intervalId = setInterval(() => {
  //     const newBoardData = generateRandomBoardData();
  
  //     setBoard(newBoardData);
  //     console.error('New board data', newBoardData);
  //   }, 1000); // 
  
  //   return () => clearInterval(intervalId);
  // }, [socketData]);

  // useEffect(() => {


  //   if (stepsCounter === 0) {
  //     return; //This is to avoid the first render when the board is empty
  //   }
  //   setSocketData( socketData + 1);

  //   const kingBlackRow = kingBlackPos.row;
  //   const kingBlackCol = kingBlackPos.col;

  //   const kingWhiteRow = kingWhitePos.row;
  //   const kingWhiteCol = kingWhitePos.col;

  //   //TODO: Check if the Kings are in danger after each movement
  //   const objectKingWhite = isInDanger(board, 'White_King', {row: kingWhiteRow, col: kingWhiteCol});
  //   const objectKingBlack = isInDanger(board, 'Black_King', {row: kingBlackRow, col: kingBlackCol});

  //   const checkIsCheckMate = (row:number, col:number, kingColor:string) => {

  //     console.error('***The King is in danger, let\'s check if it\'s checkmate***');

  //     const possibleMoves = [
  //       {row: row+1, col: col},
  //       {row: row-1, col: col},
  //       {row: row, col: col+1},
  //       {row: row, col: col-1},
  //       {row: row+1, col: col+1},
  //       {row: row+1, col: col-1},
  //       {row: row-1, col: col+1},
  //       {row: row-1, col: col-1},
  //     ];

  //     let possibleDangerPieces = [];
  //     const actualDangerPieces: DangerPiece[] = [];

  //     if(whoGoes === 'White') {
  //     possibleDangerPieces = objectKingWhite.currentDangerPiecesLineal
  //     .concat(objectKingWhite.currentDangerPicesDiagonal)
  //     .concat(objectKingWhite.currentKnightPathPieces);
  //     } else {
  //       possibleDangerPieces = objectKingBlack.currentDangerPiecesLineal
  //       .concat(objectKingBlack.currentDangerPicesDiagonal)
  //       .concat(objectKingBlack.currentKnightPathPieces);
  //     }

  //     console.error('PossibleDangerPieces', possibleDangerPieces);

  //     let isCheckMate = true;


  //     possibleDangerPieces?.forEach((piece) => {
        
  //       if (kingColor === 'White') {
  //         const validDanger = MovementIsValid(board, piece.piece, piece.position, kingWhitePos) ? true : false;
          
  //         if (validDanger) {
  //           actualDangerPieces.push(piece);
  //         }

  //       }

  //       if (kingColor === 'Black') {
  //         const validDanger = MovementIsValid(board, piece.piece, piece.position, kingBlackPos) ? true : false;

  //         if (validDanger) {
  //           actualDangerPieces.push(piece);
  //         }

  //       }
  //       });



  //       //TODO: If we check, down below, all the pieces, this for loop wouldn't be necessary, delete it!
  //     for (let i = 0; i < possibleMoves.length; i++) {

  //       if (possibleMoves[i].row < 0 || possibleMoves[i].row > 7 || possibleMoves[i].col < 0 || possibleMoves[i].col > 7) {
  //         continue;
  //       }

  //       if (!MovementIsValid(board, `${kingColor}_King`, {row, col}, possibleMoves[i])) {
  //         continue;
  //       }

  //       const returnedDanger = isInDanger(board, `${kingColor}_King`, possibleMoves[i]);
  //       const isDanger = returnedDanger.inDanger;

  //       if (!isDanger) {
  //         //We can push to an array the possible moves the king can do in order to scape
  //         console.error(`The king ${kingColor} would be not in danger if does the movement: `, possibleMoves[i]);
  //         //Once we have the possible moves, we need to check recursively if these moves are dangerous or not
  //         isCheckMate = false;
  //         break;
  //       }
  //     }

      
  //     console.log('ActualDangerPieces', actualDangerPieces);
  //     // let dangerousPossibleEatablePieces = [];

  //     const colorPiecesToSearch = kingColor === 'White' ? 'White' : 'Black';

  //   actualDangerPieces.forEach((actualDangerPiece) => {

  //       board.forEach((rowArray, row) => {

  //         rowArray.forEach((piece, col) => {

  //           console.error(' estamos buscando piezas de color', colorPiecesToSearch);

  //             if(piece.split('_')[0] === colorPiecesToSearch) {

  //             //TODO: Refactor this two ifs statements into a more compact one

  //               const isValid = MovementIsValid(board, piece, {row, col},
  //                 {row: actualDangerPiece.position.row, col: actualDangerPiece.position.col});

  //               if (isValid) {
  //                 // dangerousPossibleEatablePieces.push({piece, position: {row, col}});
                  
  //                 console.error('HAY UNA SALIDA AL JAQUE EN:::::', piece, {row, col},
  //                   'que se debe mover hacia', actualDangerPiece.position);

  //                 isCheckMate = false;

  //               }

  //           }

  //           });

  //         });

  //     });


  //     if (isCheckMate) {
  //       alert('Checkmate!');
  //       console.error('CHECKMATE, THE KING LOSER IS', kingColor);
  //     }
  //   }


  //   if (objectKingWhite.inDanger || objectKingBlack.inDanger) {
  //     alert('Check! The king is in danger');
  //     checkIsCheckMate(kingWhiteRow, kingWhiteCol, `${whoGoes === 'White' ? 'White' : 'Black'}`);
  //     // checkIsCheckMate(kingBlackRow, kingBlackCol, 'Black');
  //   }
  // }
  // , [whoGoes]);


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

    if (draggedPiece.row === row && draggedPiece.col === col) {
      return;
    }

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

      //Check if the king's are moving to a check position, if so, don't allow the movement and show a message 
      
      //TODO: Fix this two ifs, for a more realistic game mode, we decided to allow the player to move the king to a dangerous position
      // if (kingWhiteDanger && draggedPiece.piece !== 'White_King'
      //   && draggedPiece.piece.split('_')[0] === 'White') {
      //   console.error('White King in danger, you cannot MOVE THIS PIECE');
      //   return;
      // }
      // if (kingBlackDanger && draggedPiece.piece !== 'Black_King'
      //   && draggedPiece.piece.split('_')[0] === 'Black') {
      //     console.error('BLACK King in danger, you cannot MOVE THIS PIECE');
      //   return;
      // }

      setWhoGoes(whoGoes === 'White' ? 'Black' : 'White');
      const newBoard = board.slice();
      newBoard[draggedPiece.row][draggedPiece.col] = '';
      newBoard[row][col] = draggedPiece.piece;
      // setBoard(newBoard);
      sendRequestMove(row, col, draggedPiece);
    }
  };
  

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
      {!boardLoaded ? <button onClick={() => setBoardLoaded(true)}>Load board</button> : null}
      { boardLoaded && board.length> 0 ? (
        
        board?.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className={`row_${rowIndex}`} style={rowStyle}>
              {
                row?.map((pieceStringName, cellIndex) => {
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
      ) : (<div>Loading...</div>)
      }


    </>
  )
}

export default App
