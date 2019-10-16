import { Grid, Coord, Cells } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';
import { Score } from '../src/Domain/Score';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [], new Score(2))).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(
                5,
                [expected, unexpected, unexpected, unexpected, unexpected],
                new Score(5)
            );

            expect(grid.cellByCoodinates(0, 0)).toEqual(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(
                4,
                [
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    unexpected,
                    expected,
                ],
                new Score(8)
            );

            const cell = grid.cellByCoodinates(3, 1);
            expect(cell).toEqual(expected);
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any bombs', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of bombs', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 bombs out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const bombsCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(bombsCount).toBe(10);
        });
    });

    describe('dig all neighbours when there is no bombs around', () => {
        describe('dug cell has bomb', () => {
            test('does not dig bombs around', () => {
                const cellWithBomb = Cell.withBomb();
                const cellWithoutBomb = Cell.withoutBomb();
                const columns = 2;
                const cells = [cellWithBomb, cellWithoutBomb];
                const score = new Score(cells.length);
                const initialGrid = new Grid(columns, cells, score);
                const grid = initialGrid.sendActionToCell(0, 'dig');
                expect(grid.cellByIndex(0)).toEqual(cellWithBomb.dig());
                const lastCell = checkNotNull(grid.cellByIndex(1));
                expect(ignoreBombsAroundValue(lastCell)).toEqual(
                    cellWithoutBomb
                );
            });
        });
        describe('dug cell has a bomb around', () => {
            test('does not dig bombs around', () => {
                const cellWithBomb = Cell.withBomb();
                const cellWithoutBomb = Cell.withoutBomb();
                const columns = 2;
                const cells = [cellWithBomb, cellWithoutBomb];
                const score = new Score(cells.length);
                const initialGrid = new Grid(columns, cells, score);
                const grid = initialGrid.sendActionToCell(1, 'dig');
                expect(grid.cellByIndex(0)).toEqual(cellWithBomb);
                const lastCell = checkNotNull(grid.cellByIndex(1));
                expect(lastCell).toEqual(new Cell(false, false, true, 1));
            });
        });
        describe('dug cell with no bomb around', () => {
            test('all bombs around should be dug', () => {
                const cellWithBomb = Cell.withBomb();
                const cellWithoutBomb = Cell.withoutBomb();
                const columns = 5;
                const cells = [
                    cellWithBomb,
                    ...Array(11).fill(cellWithoutBomb),
                    cellWithBomb,
                    ...Array(7).fill(cellWithoutBomb),
                ];
                const score = new Score(cells.length);
                const initialGrid = new Grid(columns, cells, score);
                // dispostion :
                //  B x x x x   expect  x  1 dug 0  0
                //  x x x x x           x  2  1  1  0
                //  x x B x x           x  x  x  1  0
                //  x x x x x           x  x  x  1  0

                //          indexes:    0  1  2  3  4
                //                      5  6  7  8  9
                //                     10 11 12 13 14
                //                     15 16 17 18 19

                const grid = initialGrid.sendActionToCell(2, 'dig');

                const expectCellToBe = (dug: boolean) => (
                    cellIndex: number
                ) => {
                    expect(checkNotNull(grid.cellByIndex(cellIndex)).dug).toBe(
                        dug
                    );
                };

                const expectCellToBeDug = expectCellToBe(true);
                const expectCellToNotBeDug = expectCellToBe(false);

                expectCellToNotBeDug(0);
                expectCellToBeDug(1);
                expectCellToBeDug(2);
                expectCellToBeDug(3);
                expectCellToBeDug(4);
                expectCellToNotBeDug(5);
                expectCellToBeDug(6);
                expectCellToBeDug(7);
                expectCellToBeDug(8);
                expectCellToBeDug(9);
                expectCellToNotBeDug(10);
                expectCellToNotBeDug(11);
                expectCellToNotBeDug(12);
                expectCellToBeDug(13);
                expectCellToBeDug(14);
                expectCellToNotBeDug(15);
                expectCellToNotBeDug(16);
                expectCellToNotBeDug(17);
                expectCellToBeDug(18);
                expectCellToBeDug(19);
            });
        });
        const checkNotNull = <T>(element: T | undefined | null): T => {
            expect(element).toBeDefined();
            return element!;
        };
    });

    describe('allows to cancel last shot', () => {
        test('gets back to previous grid when canceling shot', () => {
            const cellWithBomb = Cell.withBomb();
            const cellWithoutBomb = Cell.withoutBomb();
            const columns = 3;
            const cells = [cellWithBomb, ...Array(5).fill(cellWithoutBomb)];
            const score = new Score(cells.length);
            const initialGrid = new Grid(columns, cells, score);

            const dugGrid = initialGrid.sendActionToCell(2, 'dig');

            const canceledGrid = dugGrid.cancelLastShot();

            expect(canceledGrid).toEqual(initialGrid);
        });
    });

    const ignoreBombsAroundValue = ({ hasBomb, flagged, dug }: Cell): Cell => {
        return new Cell(hasBomb, flagged, dug);
    };
});
