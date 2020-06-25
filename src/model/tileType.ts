export class TileType {
    private _id: number
    private _name: string

    constructor(id: number, name: string) {
        this._id = id
        this._name = name
    }

    /* #region Getters and Setters */
    get id(): number {
        return this._id
    }

    get name(): string {
        return this._name
    }
    /* #endregion */
}