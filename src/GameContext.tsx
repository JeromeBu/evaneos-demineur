import React, { useEffect } from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';

type GameContextProps = {
    grid: Grid;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    cancelLastShot: () => void;
    score: number;
};

const initialContext: GameContextProps = {
    grid: Grid.generate(10, 10, 10),
    updateGridCellStatus: () => {},
    cancelLastShot: () => {},
    score: 0,
};

const useForceUpdate = () => {
    const [bool, setBool] = React.useState<boolean>();
    return () => setBool(!bool);
};

const useStateGridCells = (initialValue: Grid): GameContextProps => {
    const [grid, setGrid] = React.useState(initialValue);
    const forceUpdate = useForceUpdate();

    useEffect(() => {
        const interval = setInterval(() => {
            forceUpdate();
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    });

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
        score: grid.score,
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
