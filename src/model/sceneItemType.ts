export class SceneItemType {
    private _id: number
    private _name: string
    private _collision: boolean

    public constructor(id: number, name: string, collision: boolean) {
        this._id = id
        this._name = name
        this._collision = collision
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