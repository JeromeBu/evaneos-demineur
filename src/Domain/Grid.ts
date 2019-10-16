import { Cell, CellAction } from './Cell';
import { Score } from './Score';

export type Cells = Array<Cell>;

export type Coord = {
    x: number;
    y: number;
};

type CellWithIndex = {
    index: number;
    cell: Cell;
};

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;
    private _previousGrid: Grid | null;
    private _score: Score;

    get score() {
        return this._score.value;
    }

    static generate(row: number, column: number, bombsCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = bombsCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells, new Score(cells.length));
    }

    constructor(
        column: number,
        cells: Cells,
        score: Score,
        previousGrid: Grid | null = null
    ) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
        this._previousGrid = previousGrid;
        this._score = score;
        const cellsWithRepartition = this.calculateBombsRepartition();
        this._cells = cellsWithRepartition;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    cancelLastShot(): Grid | null {
        this._score.canceledShot();
        return this._previousGrid;
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        const cellIndex = this.indexFromCoord(x, y);
        if (cellIndex === undefined) return;
        return this._cells[cellIndex];
    }

    private indexFromCoord = (x: number, y: number) => {
        if (x < 0 || y < 0) return;
        if (x >= this.column) return;
        if (y >= Math.floor(this._cells.length / this.column)) return;
        return this._column * y + x;
    };

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        if (action === 'dig' && this.isCellAndAroundEmpty(cell)) {
            const cellsIndexesToDig = this.breadthFirstSearch(
                cellIndex,
                cells,
                this.isCellAndAroundEmpty
            );
            return this.sendActionToManyCells(cellsIndexesToDig, 'dig', cells);
        }
        if (action === 'flag') {
            this._score.flagUsed();
        }

        cells[cellIndex] = cell[action]();
        const previousGrid = this;
        return new Grid(this._column, cells, this._score, previousGrid);
    }

    private isCellAndAroundEmpty = (cell: Cell) =>
        !cell.dug && !cell.hasBomb && cell.bombsAround === 0;

    private breadthFirstSearch(
        intialCellIndex: number,
        cells: Cells,
        criteria: (cell: Cell) => boolean
    ): number[] {
        const toVisit: number[] = [intialCellIndex];
        const visited: number[] = [];
        while (toVisit.length > 0) {
            const cellIndex = toVisit.shift()!;
            const respectsCritera = criteria(cells[cellIndex]);
            if (respectsCritera) {
                this.findCellsAround(cellIndex).forEach(({ index }) => {
                    if (!visited.includes(index) && !toVisit.includes(index)) {
                        toVisit.push(index);
                    }
                });
            }
            visited.push(cellIndex);
        }
        return visited.sort((a, b) => a - b);
    }

    private sendActionToManyCells(
        cellIndexes: number[],
        action: CellAction,
        cells: Cells
    ): Grid {
        cellIndexes.map(cellIndex => {
            const cell = cells[cellIndex];
            cells[cellIndex] = cell[action]();
        });

        const previousGrid = this;
        return new Grid(this._column, cells, this._score, previousGrid);
    }

    get column() {
        return this._column;
    }

    get cells() {
        return this._cells;
    }

    private calculateBombsRepartition(): Cells {
        return this._cells.map((calculatedCell, cellIndex) => {
            const neighbourghCells: Cells = this.findCellsAround(cellIndex).map(
                ({ cell }) => cell
            );
            const numberOfBombs = neighbourghCells.reduce(
                (bombs: number, cell) => (cell.hasBomb ? bombs + 1 : bombs),
                0
            );
            return calculatedCell.setBombsArounds(numberOfBombs);
        });
    }

    private findCellsAround(cellIndex: number): CellWithIndex[] {
        const { x, y } = this.getCellCoodinates(cellIndex);

        // circle aroound cell clockwise starting at x - 1 , y - 1
        const indexes = [
            this.indexFromCoord(x - 1, y - 1),
            this.indexFromCoord(x, y - 1),
            this.indexFromCoord(x + 1, y - 1),
            this.indexFromCoord(x + 1, y),
            this.indexFromCoord(x + 1, y + 1),
            this.indexFromCoord(x, y + 1),
            this.indexFromCoord(x - 1, y + 1),
            this.indexFromCoord(x - 1, y),
        ].filter(this.isDefined);

        return indexes.reduce<CellWithIndex[]>((acc, i) => {
            const cell = this.cellByIndex(i);
            if (!cell) return acc;
            return [
                ...acc,
                {
                    index: i,
                    cell,
                },
            ];
        }, []);
    }

    private isDefined = <T>(test: T | undefined): test is T => {
        return test !== undefined;
    };

    private getCellCoodinates(cellIndex: number): Coord {
        return {
            x: cellIndex % this._column,
            y: Math.floor(cellIndex / this._column),
        };
    }
}
