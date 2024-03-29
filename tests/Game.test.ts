import { isDefeated, isVictorious } from '../src/Domain/Rules';
import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';
import { Score } from '../src/Domain/Score';

describe('Rules', () => {
    test('a new game is neither lost or won', () => {
        const grid = Grid.generate(1, 1, 0);
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);
    });

    test('a game is lost if a cell with a bomb has been dug', () => {
        const cellWithoutBomb = Cell.withoutBomb();
        const cellWithBomb = Cell.withBomb();
        const grid = new Grid(1, [cellWithBomb, cellWithoutBomb], new Score(2));
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDetonated = grid.sendActionToCell(0, 'dig');

        expect(isDefeated(gridDetonated)).toBe(true);
        expect(isVictorious(gridDetonated)).toBe(false);
    });

    test('a game is won if every cell without bomb has been dug', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(2, [cellWithBomb, cellWithoutBomb], new Score(2));
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridDug = grid.sendActionToCell(1, 'dig');

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });
    test('a game is won if every cell without bomb has been dug even when cells are flagged', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const grid = new Grid(
            3,
            [cellWithBomb, cellWithoutBomb, cellWithoutBomb],
            new Score(3)
        );
        expect(isDefeated(grid)).toBe(false);
        expect(isVictorious(grid)).toBe(false);

        const gridFirstDug = grid.sendActionToCell(1, 'dig');
        const gridFlaged = gridFirstDug.sendActionToCell(0, 'flag');
        const gridDug = gridFlaged.sendActionToCell(2, 'dig');

        expect(isDefeated(gridDug)).toBe(false);
        expect(isVictorious(gridDug)).toBe(true);
    });
});
