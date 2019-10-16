import { Cell } from '../src/Domain/Cell';
import { Score, Trigger } from '../src/Domain/Score';
import { Grid } from '../src/Domain/Grid';

describe('counts score', () => {
    test('keeps the correct number of points', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const columns = 3;
        const cells: Cell[] = [cellWithBomb, ...Array(8).fill(cellWithoutBomb)];
        const initialScore = cells.length;
        const triggersNever: Trigger = () => {};
        const score = new Score(initialScore, triggersNever);

        const initialGrid = new Grid(columns, cells, score);

        const flaggedGrid = initialGrid.sendActionToCell(3, 'flag');
        expect(flaggedGrid.score).toEqual(initialScore - 1);

        const dugGrid = flaggedGrid.sendActionToCell(2, 'dig');

        const canceledGrid = dugGrid.cancelLastShot()!;
        expect(canceledGrid.score).toEqual(initialScore - 1 - 5);
    });
    test('handles time passing', () => {
        const cellWithBomb = Cell.withBomb();
        const cellWithoutBomb = Cell.withoutBomb();
        const columns = 3;
        const cells: Cell[] = [cellWithBomb, ...Array(8).fill(cellWithoutBomb)];
        const initialScore = cells.length;
        const triggersInstantly: Trigger = callback => {
            callback();
        };
        const score = new Score(initialScore, triggersInstantly);

        const initialGrid = new Grid(columns, cells, score);

        const substract = (intialValue: number, toRemove: number) =>
            Math.round(Math.max(0, intialValue - toRemove) * 10) / 10;

        expect(initialGrid.score).toEqual(substract(initialScore, 0.2));
    });
});
