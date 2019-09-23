import { Grid } from './Grid';

export const isDefeated = (grid: Grid) => {
    for (let cell of grid) {
        if (cell.detonated === true) return true;
    }
    return false;
};

export const isVictorious = (grid: Grid) => {
    const { cells } = grid;
    const defeated = isDefeated(grid);
    if (defeated) return false;
    const minedCells = cells.filter(cell => cell.hasMine);
    const untouchedCells = grid.cells.filter(
        ({ status }) => status === 'untouched'
    );
    return untouchedCells.length === minedCells.length;
};
