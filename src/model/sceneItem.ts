import { Sprite } from "../spriteManager";
import { Tile } from "./tile";
import { SceneItemType } from "./sceneItemType";

export class SceneItem {
    private _id: number
    private _sprite: Sprite
    private _sceneItemTypeId: number
    private _sceneItemTypeVariation: number
    private _tileId: number

    private _sceneItemType: SceneItemType
    private _tile: Tile

    constructor(id: number, sceneItemType: SceneItemType, sprite: Sprite, sceneItemTypeVariation: number, tile: Tile) {
        this._id = id
        this._sceneItemType = sceneItemType
        this._sceneItemTypeId = sceneItemType.id
        this._sceneItemTypeVariation = sceneItemTypeVariation
        this._sprite = sprite
        this._tile = tile
        this._tileId = tile.id
    }

    /* #region Getters and Setters */
    get id(): number {
        return this._id
    }

    get sceneItemTypeId(): number {
        return this._sceneItemTypeId
    }

    get sceneItemTypeVariation(): number {
        return this._sceneItemTypeVariation
    }

    get sceneItemType(): SceneItemType {
        return this._sceneItemType
    }

    get tileId(): number {
        return this._tileId
    }

    get tile(): Tile {
        return this._tile
    }

    set sceneItemTypeVariation(value: number) {
        this._sceneItemTypeVariation = value
    }
    /* #endregion */
}