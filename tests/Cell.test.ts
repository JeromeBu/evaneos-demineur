import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';

describe(Cell, () => {
    describe('without a bomb', () => {
        let cell: Cell;
        beforeEach(() => {
            cell = Cell.withoutBomb();
        });

        test('does not explodes if untouched', () => {
            expect(cell.detonated).toBe(false);
        });

        test('can be flagged and still not explose', () => {
            cell.flag();
            expect(cell.detonated).toBe(false);
        });

        test('does not explode even when you dig it (there is no bomb)', () => {
            cell.dig();
            expect(cell.detonated).toBe(false);
        });

        describe('when cell has been dug', () => {
            test("can't be flagged", () => {
                const dugCell = cell.dig();

                expect(() => {
                    dugCell.flag();
                }).toThrowError();
            });
            test('mineArround is 1 if there is a mine around', () => {
                const cellWithoutBomb = Cell.withoutBomb();
                const cellWithBomb = Cell.withBomb();
                const grid = new Grid(2, [
                    cellWithoutBomb,
                    cellWithoutBomb,
                    cellWithoutBomb,
                    cellWithBomb,
                ]);
                const gridDug = grid.sendActionToCell(0, 'dig');
                const dugCell = gridDug.cells[0];
                expect(dugCell.status).toBe('dug');
                expect(dugCell.minesAround).toBe(1);
            });
        });
    });

    describe('with a bomb', () => {
        const trappedCell = Cell.withBomb();

        test('does not explodes if untouched', () => {
            expect(trappedCell.detonated).toBe(false);
        });

        test('can be flagged and still not explose', () => {
            const flaggedTrappedCell = trappedCell.flag();
            expect(flaggedTrappedCell.detonated).toBe(false);
            expect(flaggedTrappedCell.flagged).toBe(true);
        });

        test('blows player face when he dig this cell', () => {
            const dugTrappedCell = trappedCell.dig();
            expect(dugTrappedCell.detonated).toBe(true);
        });
    });
});
