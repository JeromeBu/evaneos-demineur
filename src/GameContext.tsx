import React from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';

type GameContextProps = {
    grid: Grid;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    cancelLastShot: () => void;
};

const initialContext: GameContextProps = {
    grid: Grid.generate(10, 10, 10),
    updateGridCellStatus: () => {},
    cancelLastShot: () => {},
};

const useStateGridCells = (initialValue: Grid): GameContextProps => {
    const [grid, setGrid] = React.useState(initialValue);

    return {
        grid,
        updateGridCellStatus: (index: number, action: CellAction) => {
            const newGrid = grid.sendActionToCell(index, action);
            setGrid(newGrid);
        },
        cancelLastShot: () => {
            const previousGrid = grid.cancelLastShot();
            if (previousGrid) setGrid(previousGrid);
        },
    };
};

export const GameContext = React.createContext<GameContextProps>(
    initialContext
);

export const GameContextProvider: React.FunctionComponent<
    React.ReactNode
> = props => {
    const gameContextProps = useStateGridCells(initialContext.grid);

    return (
        <GameContext.Provider value={gameContextProps}>
            {props.children}
        </GameContext.Provider>
    );
};
