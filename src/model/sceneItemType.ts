export class SceneItemType {
    private _id: number
    private _name: string
    private _collision: boolean

    public constructor(id: number) {
        this._id = id
    }

    /* #region Getters and Setters */
    get id(): number {
        return this._id
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value;
    }

    set collision(value: boolean) {
        this._collision = value;
    }
    /* #endregion */
}