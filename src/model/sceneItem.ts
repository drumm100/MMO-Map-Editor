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

    constructor(id: number) {
        this._id = id
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

    set sceneItemTypeId(value: number) {
        this._sceneItemTypeId = value
    }

    set sceneItemTypeVariation(value: number) {
        this._sceneItemTypeVariation = value
    }

    set sceneItemType(value: SceneItemType) {
        this._sceneItemType = value
    }

    set tileId(value: number) {
        this._tileId = value
    }

    set tile(value: Tile) {
        this._tile = value
    }

    set sprite(value: Sprite) {
        this._sprite = value
    }

    /* #endregion */
}