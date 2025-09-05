
import { useState } from "react"

import GameBoard from "./components/GameBoard.jsx"
import Player from "./components/Player.jsx"
import Log from "./components/Log.jsx"
import GameOver from "./components/GameOver.jsx"

import { WINNING_COMBINATIONS } from "./components/winning-combinations.js"

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveGameBoard(turns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])];

  for (const turn of turns) {
    const { square, player } = turn;
    const { row, column } = square;

    gameBoard[row][column] = player;
  }

  return gameBoard;
}

function deriveActivePlayer(turns) {
  let currentPlayer = 'X';

  if (turns.length > 0 && turns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function deriveWinner(board, players) {
  let winner;

    for (const combination of WINNING_COMBINATIONS) {
      const firstWinningSquare = board[combination[0].row][combination[0].column];
      const secondWinningSquare = board[combination[1].row][combination[1].column];
      const thirdWinningSquare = board[combination[2].row][combination[2].column];
  
      if (firstWinningSquare && firstWinningSquare === secondWinningSquare && secondWinningSquare === thirdWinningSquare) {
        winner = players[firstWinningSquare];
      }
  
      return winner;
    }
  
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, saveGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  
  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, columnIndex) {
    saveGameTurns(previousTurns => {
      const currentPlayer = deriveActivePlayer(previousTurns);

      const updatedTurns = [
        { square: { row: rowIndex, column: columnIndex }, player: currentPlayer },
        ...previousTurns
      ];

      return updatedTurns;
    });
  }

  function handleRematch() {
    saveGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(previousPlayers => {
      return { ...previousPlayers, [symbol]: newName }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player onChangeName={handlePlayerNameChange} initialName={PLAYERS.X} symbol="X" isActive={activePlayer === 'X'} />
          <Player onChangeName={handlePlayerNameChange} initialName={PLAYERS.O} symbol="O" isActive={activePlayer === 'O'} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch} />}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App;
