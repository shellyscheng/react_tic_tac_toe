import React, { useState } from "react";

function Square({value, onSquareClick}) {

  return (  
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

export function Board({ xIsNext, squares, onPlay }) {  

  function handleClick(i) {
    if(squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    xIsNext? nextSquares[i] = "X" : nextSquares[i] = "O";
    onPlay(nextSquares)
  }

  const winner = calculateWinner(squares);
  let status = winner ? "Winner: " + winner : "Next player: " + (xIsNext ? "X" : "O")

  const boardSquares =  []
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j
      row.push(
        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
      )
    }
    boardSquares.push(<div key={i} className="board-row">{row}</div>)
  }

  return (
    <div>
      <div className="status">{status}</div>
      {boardSquares}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)])
  const [currentMove, setCurrentMove] = useState(0)
  const [sortAsc, setSortAsc] = useState(true)
  const xIsNext = currentMove % 2 === 0

  const currentSquares = history[currentMove]

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start"
    }

    return (
      <li key={move}>
        {move === currentMove ? "You are at move #" + move : <button onClick={() => setCurrentMove(move)}>{description}</button>}
      </li>
    )
  })

  if(!sortAsc) {
    moves.reverse()
  }

  return(
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <button onClick={() => setSortAsc(prevState => !prevState)}>
          Sort {sortAsc ? 'descending' : 'ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }

  return null;
}
