import { isDefeated, isVictorious } from '../src/Domain/Rules';
import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe('Rules', () => {
    test('a new game is neither lost or won', () => {
        const grid = Grid.generate(1, 1, 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);
    });

    test('a game is lost if a cell with a bomb has been dug', () => {
        const cellWithBomb = Cell.withBomb();
        const grid = new Grid(1, [cellWithBomb]);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDetonated = grid.sendActionToCell(0, 'dig');

        expect(isDefeated(gridDetonated)).toBe(true);
        expect(isVictorious(gridDetonated)).toBe(false);
    });

    test('a game is won if every cell without bomb has been dug', () => {
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(1, [cellWithoutBomb]);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDug = grid.sendActionToCell(0, 'dig');

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });
});
