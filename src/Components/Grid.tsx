import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { isDefeated, isVictorious } from '../Domain/Rules';

export const Grid: React.FunctionComponent = () => {
    const { grid, updateGridCellStatus } = React.useContext(GameContext);

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const gameOver =
        (isDefeated(grid) && 'defeat') ||
        (isVictorious(grid) && 'victory') ||
        false;

    return (
        <React.Fragment>
            <Game gameOver={gameOver} />
            <div
                style={{
                    display: 'flex',
                    border: '1px solid black',
                    boxSizing: 'content-box',
                    flexWrap: 'wrap',
                    width: `calc(40px * ${grid.column})`,
                }}
            >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        status={cell.status}
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
        </React.Fragment>
    );
};
