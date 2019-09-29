export class Score {
    private _value: number;

    get value() {
        return this._value;
    }

    constructor(initialValue: number) {
        this._value = initialValue;
        setInterval(() => {
            this.removePoints(0.2);
        }, 1000);
    }

    flagUsed() {
        this.removePoints(1);
    }

    canceledShot() {
        this.removePoints(5);
    }

    private removePoints(pointsToRemove: number) {
        this._value =
            Math.round(Math.max(0, this._value - pointsToRemove) * 10) / 10;
    }
}
