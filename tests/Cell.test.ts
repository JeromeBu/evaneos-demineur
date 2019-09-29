import { Cell } from '../src/Domain/Cell';
import { Grid } from '../src/Domain/Grid';
import { Score } from '../src/Domain/Score';

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
            test('minesArround shows the right amount of neighbour mines', () => {
                const cellWithout = Cell.withoutBomb();
                const cellWithBomb = Cell.withBomb();
                const cells = [
                    cellWithBomb,
                    cellWithout,
                    cellWithout,
                    cellWithout,
                    cellWithout,
                    cellWithout,
                    cellWithout,
                    cellWithBomb,
                    cellWithBomb,
                ];
                const score = new Score(cells.length);
                const grid = new Grid(3, cells, score);
                // dispostion :
                //     x 0 0
                //     0 0 0
                //     0 x x
                expect(grid.cells[0].minesAround).toBe(0);
                expect(grid.cells[1].minesAround).toBe(1);
                expect(grid.cells[2].minesAround).toBe(0);
                expect(grid.cells[3].minesAround).toBe(2);
                expect(grid.cells[4].minesAround).toBe(3);
                expect(grid.cells[5].minesAround).toBe(2);
                expect(grid.cells[8].minesAround).toBe(1);
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
