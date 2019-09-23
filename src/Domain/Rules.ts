import { Grid } from './Grid';

export const isDefeated = (grid: Grid) => {
    for (let cell of grid) {
        if (cell.detonated === true) return true;
    }
    return false;
};

export const isVictorious = (grid: Grid) => {
    for (let cell of grid) {
        if (
            (cell.dug === false && cell.flagged === false) ||
            cell.detonated === true
        ) {
            return false;
        }
    }
    return true;
};
