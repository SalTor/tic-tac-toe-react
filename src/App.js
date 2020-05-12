import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const size = 3
const sizeSq = 3*3
const initialGrid = Array(size).fill(Array(size).fill(0))
/*
    [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]
*/

function App() {
    const [grid, updateGrid] = useState(initialGrid)
    const [player, changePlayer] = useState('1')
    const [rowCount, trackRow] = useState(Array(size).fill(0))
    const [colCount, trackCol] = useState(Array(size).fill(0))
    const [diagL, trackDiagL] = useState(0)
    const [diagR, trackDiagR] = useState(0)
    const [winner, trackWinner] = useState(null)
    const [moves, trackMoves] = useState(0)
    const [stalemate, trackStalemate] = useState(false)

    const move = (row, col) => {
        const val = player === '1' ? 1 : -1
        let newWinner

        const gridCopy = grid.slice().map(originalRow => originalRow.slice())
        gridCopy[row][col] = player === '1' ? 'X' : 'O'
        updateGrid(gridCopy)

        const wins = val => {
            if (!newWinner && Math.abs(val) === size) {
                newWinner = player
            }
        }

        const rowCopy = rowCount.slice()
        rowCopy[row] += val
        trackRow(rowCopy)
        wins(rowCopy[row])

        const colCopy = colCount.slice()
        colCopy[col] += val
        trackCol(colCopy)
        wins(colCopy[col])

        if (row === col) {
            const diagLCt = diagL + val
            trackDiagL(diagLCt)
            wins(diagLCt)
        }

        if (row === size - col - 1) {
            const diagRCt = diagR + val
            trackDiagR(diagRCt)
            wins(diagRCt)
        }

        if (newWinner) trackWinner(newWinner)

        if (player === '1') {
            changePlayer('2')
        } else {
            changePlayer('1')
        }

        if (moves + 1 === sizeSq) {
            trackStalemate(true)
        }
        trackMoves(moves + 1)
    }

    const resetGame = () => {
        console.log('TODO: reset game')
    }

    return (
        <div className="App">
            <header>
                <h1>Tic Tac Toe</h1>
                {(winner || stalemate) && <button type="button" onClick={resetGame}>Reset Game</button>}
            </header>

            {winner ? (
                <h2>Winner is: {winner}</h2>
            ) : (
                stalemate ? (
                    <h2>Stalemate!</h2>
                ) : (
                    <h2>Whose turn: Player {player}</h2>
                )
            )}

            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div className="grid__row" key={`row_${rowIndex}`}>
                        {grid[rowIndex].map((col, colIndex) => {
                            const val = grid[rowIndex][colIndex]
                            const hasVal = val !== 0
                            const disabled = winner || hasVal
                            const tileSize = 30
                            return (
                                <button
                                    className="grid__tile"
                                    style={{height: tileSize, width: tileSize}}
                                    disabled={disabled}
                                    onClick={() => disabled || move(rowIndex, colIndex)}
                                    key={`tile_${rowIndex}${colIndex}`}
                                    type="button"
                                >{val || ' '}</button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
