import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const size = 3
const sizeSq = size*size
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
    const gridRef = useRef()
    const canvasRef = useRef()
    const [grid, updateGrid] = useState(initialGrid)
    const [player, changePlayer] = useSessionStorageState('A', 'playerTurn')
    const [rowCount, trackRow] = useState(initialRowCount)
    const [colCount, trackCol] = useState(initialColCount)
    const [diagL, trackDiagL] = useState(0)
    const [diagR, trackDiagR] = useState(0)
    const [winner, trackWinner] = useState(null)
    const [moves, trackMoves] = useState(0)
    const [stalemate, trackStalemate] = useState(false)
    const [stalemateCount, trackStalemateCounts] = useSessionStorageState(0, 'playersStalemates')
    const [playerAWins, trackPlayerAWins] = useSessionStorageState(0, 'playerAWins')
    const [playerBWins, trackPlayerBWins] = useSessionStorageState(0, 'playerBWins')

    useEffect(() => {
        gridRef.current.style.setProperty('--grid-size', size)
    }, [])

    const drawWinningPath = (coords) => {
        const [[y1, x1], [y2, x2]] = coords
        const tileSize = gridRef.current.children[0].children[0].clientHeight
        const c = canvasRef.current
        c.height = gridRef.current.clientHeight
        c.width = gridRef.current.clientWidth
        const mod = tileSize / 2
        const ctx = c.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(mod + (tileSize * x1), mod + (tileSize * y1))
        ctx.lineTo(mod + (tileSize * x2), mod + (tileSize * y2))
        ctx.lineWidth = 15
        ctx.lineCap = 'round'
        ctx.strokeStyle = 'green'
        ctx.stroke()
    }

    const move = (row, col) => {
        const val = player === 'A' ? 1 : -1
        let newWinner = null

        const gridCopy = grid.slice().map(originalRow => originalRow.slice())
        gridCopy[row][col] = player === 'A' ? 'X' : 'O'
        updateGrid(gridCopy)

        const wins = (val, start, end) => {
            if (!newWinner && Math.abs(val) === size) {
                drawWinningPath([start, end])
                newWinner = true
            }
        }

        const rowCopy = rowCount.slice()
        rowCopy[row] += val
        trackRow(rowCopy)
        wins(rowCopy[row], [row, 0], [row, size - 1])

        const colCopy = colCount.slice()
        colCopy[col] += val
        trackCol(colCopy)
        wins(colCopy[col], [0, col], [size - 1, col])

        if (row === col) {
            const diagLCt = diagL + val
            trackDiagL(diagLCt)
            wins(diagLCt, [0, 0], [size - 1, size - 1])
        }

        if (row === size - col - 1) {
            const diagRCt = diagR + val
            trackDiagR(diagRCt)
            wins(diagRCt, [0, size - 1], [size - 1, 0])
        }

        if (newWinner) {
            if (player === 'A') {
                trackPlayerAWins(playerAWins + 1)
                changePlayer('A')
            } else {
                trackPlayerBWins(playerBWins + 1)
                changePlayer('B')
            }
            trackWinner(player)
        } else {
            if (moves + 1 === sizeSq) {
                trackStalemate(true)
                trackStalemateCounts(stalemateCount + 1)
            } else if (player === 'A') {
                changePlayer('B')
            } else {
                changePlayer('A')
            }
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
            <nav>
                <h3>Player A: {playerAWins}</h3>
                <h3>Player B: {playerBWins}</h3>
                <h3>Stalemates: {stalemateCount}</h3>
            </nav>

            <header>
                <h1>Tic Tac Toe</h1>
                {(winner || stalemate) && <button type="button" onClick={resetGame}>Reset Game</button>}
            </header>

            {winner ? (
                <h2>Winner is: Player {winner}</h2>
            ) : (
                stalemate ? (
                    <h2>Stalemate!</h2>
                ) : (
                    <h2>Whose turn: Player {player}</h2>
                )
            )}

            <div className="gridWrapper">
                <div className="grid" ref={gridRef}>
                    {grid.map((row, rowIndex) => (
                        <div className="grid__row" key={`row_${rowIndex}`}>
                            {grid[rowIndex].map((col, colIndex) => {
                                const val = grid[rowIndex][colIndex]
                                const hasVal = val !== 0
                                const disabled = winner || hasVal
                                return (
                                    <button
                                        className={`grid__tile ${hasVal ? 'm_hasVal' : 'm_noVal'}`}
                                        disabled={disabled}
                                        onClick={() => disabled || move(rowIndex, colIndex)}
                                        key={`tile_${rowIndex}${colIndex}`}
                                        type="button"
                                    >
                                        <span>{val || ' '}</span>
                                    </button>
                                )
                            })}
                        </div>
                    ))}

                    <canvas
                        ref={canvasRef}
                        style={{ display: winner ? 'inline' : 'none', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    />
                </div>
            </div>

            <button style={{marginTop: 100}} type="button" onClick={() => {
                sessionStorage.clear()
                window.location.reload()
            }}>
                Clear History
            </button>
        </div>
    );
}

export default App;
