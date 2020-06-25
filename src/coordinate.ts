export class Coordinate {
    private _x: number;
    private _y: number;
    private _z: number;

    constructor(x: number, y: number, z: number) {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    /* #region Getters and Setters */
    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get z(): number {
        return this._z;
    }

    set x(value: number) {
        this._x = value;
    }
    
    set y(value: number) {
        this._y = value;
    }

    set z(value: number) {
        this._z = value;
    }
    /* #endregion */
}