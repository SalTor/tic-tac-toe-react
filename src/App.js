import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const size = 3
const sizeSq = 3*3
const initialGrid = Array(size).fill(Array(size).fill(0))
const initialRowCount = Array(size).fill(0)
const initialColCount = Array(size).fill(0)
/*
    [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]
*/

const useSessionStorageState = (initialState, stateId) => {
    const existingState = JSON.parse(sessionStorage.getItem(stateId))
    const [state, setState] = useState(existingState || initialState)

    // Persist all formState changes to localStorage
    useEffect(() => {
        sessionStorage.setItem(stateId, JSON.stringify(state))
    }, [state, stateId])

    return [state, setState]
}

function App() {
    const [grid, updateGrid] = useState(initialGrid)
    const [player, changePlayer] = useSessionStorageState('1', 'playerTurn')
    const [rowCount, trackRow] = useState(initialRowCount)
    const [colCount, trackCol] = useState(initialColCount)
    const [diagL, trackDiagL] = useState(0)
    const [diagR, trackDiagR] = useState(0)
    const [winner, trackWinner] = useState(null)
    const [moves, trackMoves] = useState(0)
    const [stalemate, trackStalemate] = useState(false)
    const [player1Wins, trackPlayer1Wins] = useSessionStorageState(0, 'player1Wins')
    const [player2Wins, trackPlayer2Wins] = useSessionStorageState(0, 'player2Wins')

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

        if (newWinner) {
            if (player === '1') {
                trackPlayer1Wins(player1Wins + 1)
                changePlayer('1')
            } else {
                trackPlayer2Wins(player2Wins + 1)
                changePlayer('2')
            }
            trackWinner(newWinner)
        } else {
            if (player === '1') {
                changePlayer('2')
            } else {
                changePlayer('1')
            }
        }

        if (moves + 1 === sizeSq) {
            trackStalemate(true)
        }
        trackMoves(moves + 1)
    }

    const resetGame = () => {
        updateGrid(initialGrid)
        trackRow(initialRowCount)
        trackCol(initialColCount)
        trackDiagL(0)
        trackDiagR(0)
        trackWinner(null)
        trackMoves(0)
        trackStalemate(false)
    }

    return (
        <div className="App">
            <header>
                <h1>Tic Tac Toe</h1>
                {(winner || stalemate) && <button type="button" onClick={resetGame}>Reset Game</button>}
            </header>

            <h3>Player 1 wins: {player1Wins}</h3>
            <h3>Player 2 wins: {player2Wins}</h3>

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
                                >{val || '-'}</button>
                            )
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
