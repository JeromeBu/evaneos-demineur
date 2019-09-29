import { Cell, CellAction } from './Cell';

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

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }

        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];

            cells[rand] = cells[index];
            cells[index] = cell;
        }

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
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
        const cellsWithRepartition = this.calculateMineRepartition();
        this._cells = cellsWithRepartition;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
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

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    get column() {
        return this._column;
    }

    get cells() {
        return this._cells;
    }

    private calculateMineRepartition(): Cells {
        return this._cells.map((calculatedCell, cellIndex) => {
            const neighbourghCells: Cells = this.findCellsAround(cellIndex).map(
                ({ cell }) => cell
            );
            const numberOfMines = neighbourghCells.reduce(
                (mines: number, cell) => (cell.hasMine ? mines + 1 : mines),
                0
            );
            return calculatedCell.setMinesArounds(numberOfMines);
        });
    }

    findCellsAround(cellIndex: number): CellWithIndex[] {
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

    getCellCoodinates(cellIndex: number): Coord {
        return {
            x: cellIndex % this._column,
            y: Math.floor(cellIndex / this._column),
        };
    }
}
