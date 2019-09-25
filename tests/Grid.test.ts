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

            expect(grid.cellByCoodinates(0, 0)).toBe(expected);
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
            expect(cell).toBe(expected);
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
    describe('getCellCoodinates', () => {
        it('on one cell grid', () => {
            const cellWithoutBomb = Cell.withoutBomb();
            const columns = 1;
            const cells = [cellWithoutBomb];
            const grid = new Grid(columns, cells);
            expectCellCoordinates(grid, 0, { x: 0, y: 0 });
        });

        it('on 4x4 grid', () => {
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
        it('on one cell grid', () => {
            const cellWithoutBomb = Cell.withoutBomb();
            const columns = 1;
            const cells = [cellWithoutBomb];
            const grid = new Grid(columns, cells);
            expectCellsAround(grid, 0, []);
        });
        it('on 3x2 grid', () => {
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
            expect(gird.findCellsAround(cellIndex)).toEqual(expectedCells);
        };
    });
});
