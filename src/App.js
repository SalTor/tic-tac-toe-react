import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const size = 3
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
    const [winnerExists, setWinnerExists] = useState(false)

    const move = () => {}

    return (
        <div className="App">
            <header>
                <h1>Tic Tac Toe</h1>
            </header>

            <div className="grid">
                {grid.map((row, rowIndex) => (
                    <div className="grid__row" key={`row_${rowIndex}`}>
                        {row.map((col, colIndex) => (
                            <button
                                className="grid__tile"
                                disabled={winnerExists}
                                onClick={() => winnerExists || move(rowIndex, colIndex)}
                                key={`tile_${colIndex}`}
                                type="button"
                            >{col}</button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
