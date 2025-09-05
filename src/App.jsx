
import { useState } from "react"

import GameBoard from "./components/GameBoard.jsx"
import Player from "./components/Player.jsx"
import Log from "./components/Log.jsx"
import GameOver from "./components/GameOver.jsx"

import { WINNING_COMBINATIONS } from "./components/winning-combinations.js"

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O';
  }

  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({
    X: 'Player 1',
    O: 'Player 2',
  });
  const [gameTurns, saveGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map((array) => [...array])];
  let winner;

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, column } = square;

    gameBoard[row][column] = player;
  }

  for (const combination of WINNING_COMBINATIONS) {
    const firstWinningSquare = gameBoard[combination[0].row][combination[0].column];
    const secondWinningSquare = gameBoard[combination[1].row][combination[1].column];
    const thirdWinningSquare = gameBoard[combination[2].row][combination[2].column];

    if (firstWinningSquare && firstWinningSquare === secondWinningSquare && secondWinningSquare === thirdWinningSquare) {
      winner = players[firstWinningSquare];
    }
  }

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
          <Player onChangeName={handlePlayerNameChange} initialName="Player 1" symbol="X" isActive={activePlayer === 'X'} />
          <Player onChangeName={handlePlayerNameChange} initialName="Player 2" symbol="O" isActive={activePlayer === 'O'} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch} />}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
