import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { isDefeated, isVictorious } from '../Domain/Rules';

const wrapper: React.CSSProperties = {
    margin: 'auto',
    width: '402px',
};

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus, cancelLastShot } = React.useContext(
        GameContext
    );

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const gameOver =
        (isDefeated(grid) && 'defeat') ||
        (isVictorious(grid) && 'victory') ||
        false;

    const isDark = (index: number): boolean => {
        const { column } = grid;
        const isOddColumn = column % 2 === 1;
        if (isOddColumn) return index % 2 === 0;
        const isLineOdd = Math.floor(index / column) % 2 === 0;
        return isLineOdd ? index % 2 === 0 : index % 2 === 1;
    };

    return (
        <div style={wrapper}>
            <Game gameOver={gameOver} cancelLastShot={cancelLastShot} />
            <div
                style={{
                    display: 'flex',
                    border: '1px solid grey',
                    boxSizing: 'content-box',
                    flexWrap: 'wrap',
                    width: `calc(40px * ${grid.column})`,
                }}
            >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        isDark={isDark(index)}
                        status={cell.status}
                        minesAround={cell.minesAround}
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
        </div>
    );
};
