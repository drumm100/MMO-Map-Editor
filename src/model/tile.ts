import { Coordinate } from "../coordinate";
import { Sprite } from "../spriteManager";
import { SceneItem } from "./sceneItem";
import { TileType } from "./tileType";

export class Tile {
    private _id: number
    private _coordinate: Coordinate
    private _tileTypeId: number
    private _tileTypeVariation: number
    private _sprite: Sprite

    private _tileType: TileType;
    private _sceneItems: Array<SceneItem>

    constructor(id: number, coordinate: Coordinate, tileType: TileType, tileTypeVariation: number, sprite: Sprite) {
        this._id = id
        this._coordinate = coordinate
        this._tileTypeId = tileType.id
        this._tileType = tileType
        this._tileTypeVariation = tileTypeVariation
        this._sprite = sprite
        this._sceneItems = new Array<SceneItem>()
    }

    /* #region Getters and Setters */
    get id(): number {
        return this._id
    }

    get sceneItems(): Array<SceneItem> {
        return this._sceneItems
    }

    get coordinate(): Coordinate {
        return this._coordinate
    }

    get tileTypeId(): number {
        return this._tileTypeId
    }

    get tileType(): TileType {
        return this._tileType
    }

    get tileTypeVariation(): number {
        return this._tileTypeVariation
    }

    set tileType(value: TileType) {
        this._tileType = value
        this._tileTypeId = value.id
    }

    set tileTypeVariation(value: number) {
        this._tileTypeVariation = value
    }

    set sceneItems(value: Array<SceneItem>) {
        this._sceneItems = value
    }
    /* #endregion */
}