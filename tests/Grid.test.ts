import { Grid, Coord, Cells } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(5, [
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoodinates(0, 0)).toEqual(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(4, [
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                expected,
            ]);

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

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });
    });

    describe('dig all neighbours when there is no mines around', () => {
        describe('dug cell has bomb', () => {
            test('does not dig mines around', () => {
                const cellWithBomb = Cell.withBomb();
                const cellWithoutBomb = Cell.withoutBomb();
                const columns = 2;
                const cells = [cellWithBomb, cellWithoutBomb];
                const initialGrid = new Grid(columns, cells);
                const grid = initialGrid.sendActionToCell(0, 'dig');
                expect(grid.cellByIndex(0)).toEqual(cellWithBomb.dig());
                const lastCell = checkNotNull(grid.cellByIndex(1));
                expect(ignoreMinesAroundValue(lastCell)).toEqual(
                    cellWithoutBomb
                );
            });
        });
        describe('dug cell has a mine around', () => {
            test('does not dig mines around', () => {
                const cellWithBomb = Cell.withBomb();
                const cellWithoutBomb = Cell.withoutBomb();
                const columns = 2;
                const cells = [cellWithBomb, cellWithoutBomb];
                const initialGrid = new Grid(columns, cells);
                const grid = initialGrid.sendActionToCell(1, 'dig');
                expect(grid.cellByIndex(0)).toEqual(cellWithBomb);
                const lastCell = checkNotNull(grid.cellByIndex(1));
                expect(lastCell).toEqual(new Cell(false, false, true, 1));
            });
        });
        describe('dug cell with no mine around', () => {
            test('all mines around should be dug', () => {
                const cellWithBomb = Cell.withBomb();
                const cellWithoutBomb = Cell.withoutBomb();
                const columns = 5;
                const cells = [
                    cellWithBomb,
                    ...Array(11).fill(cellWithoutBomb),
                    cellWithBomb,
                    ...Array(7).fill(cellWithoutBomb),
                ];
                const initialGrid = new Grid(columns, cells);
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
            const dugCell = Cell.withoutBomb().dig();
            const columns = 3;
            const cells = [cellWithBomb, ...Array(5).fill(cellWithoutBomb)];
            const initialGrid = new Grid(columns, cells);

            const dugGrid = initialGrid.sendActionToCell(2, 'dig');

            const canceledGrid = dugGrid.cancelLastShot();

            expect(canceledGrid).toEqual(initialGrid);
        });
    });

    // Following tests are testing only implementations, and are here to help dev
    // TODO : change the methods to 'private' and delete those tests
    describe('getCellCoodinates', () => {
        test('on one cell grid', () => {
            const cellWithoutBomb = Cell.withoutBomb();
            const columns = 1;
            const cells = [cellWithoutBomb];
            const grid = new Grid(columns, cells);
            expectCellCoordinates(grid, 0, { x: 0, y: 0 });
        });

        test('on 4x4 grid', () => {
            const cell = Cell.withoutBomb();
            const columns = 4;
            const cells = Array(16).fill(cell);
            const grid = new Grid(columns, cells);
            expectCellCoordinates(grid, 0, { x: 0, y: 0 });
            expectCellCoordinates(grid, 1, { x: 1, y: 0 });
            expectCellCoordinates(grid, 2, { x: 2, y: 0 });
            expectCellCoordinates(grid, 3, { x: 3, y: 0 });
            expectCellCoordinates(grid, 4, { x: 0, y: 1 });
            expectCellCoordinates(grid, 7, { x: 3, y: 1 });
            expectCellCoordinates(grid, 15, { x: 3, y: 3 });
        });

        const expectCellCoordinates = (
            gird: Grid,
            cellIndex: number,
            expectedCoordinates: Coord
        ) => {
            expect(gird.getCellCoodinates(cellIndex)).toEqual(
                expectedCoordinates
            );
        };
    });
    describe('findCellsAround', () => {
        test('on one cell grid', () => {
            const cellWithoutBomb = Cell.withoutBomb();
            const columns = 1;
            const cells = [cellWithoutBomb];
            const grid = new Grid(columns, cells);
            expectCellsAround(grid, 0, []);
        });
        test('on 3x2 grid', () => {
            const cell0 = Cell.withoutBomb();
            const cell1 = Cell.withBomb();
            const cell2 = Cell.withoutBomb();
            const cell3 = Cell.withoutBomb();
            const cell4 = Cell.withBomb();
            const cell5 = Cell.withoutBomb();
            const columns = 3;
            const cells = [cell0, cell1, cell2, cell3, cell4, cell5];
            const grid = new Grid(columns, cells);
            expectCellsAround(grid, 0, [cell1, cell4, cell3]);
            expectCellsAround(grid, 1, [cell2, cell5, cell4, cell3, cell0]);
            expectCellsAround(grid, 4, [cell0, cell1, cell2, cell5, cell3]);
            expectCellsAround(grid, 5, [cell1, cell2, cell4]);
        });

        const expectCellsAround = (
            gird: Grid,
            cellIndex: number,
            expectedCells: Cells
        ) => {
            expect(
                gird.findCellsAround(cellIndex).map(({ cell }) => {
                    return ignoreMinesAroundValue(cell);
                })
            ).toEqual(expectedCells);
        };
    });
    const ignoreMinesAroundValue = ({ hasMine, flagged, dug }: Cell): Cell => {
        return new Cell(hasMine, flagged, dug);
    };
});
