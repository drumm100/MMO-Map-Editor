import { SceneItem } from "../model/sceneItem";

export class SceneItemsDTO {
    private _sceneItems: Array<SceneItem>;

    constructor(tiles: Array<SceneItem>) {
        this._sceneItems = tiles;
    }

    public toJSON() {
        let sceneItemsData = this._sceneItems.map(sceneItem => ({
            id: sceneItem.id,
            sceneItemTypeId: sceneItem.sceneItemTypeId,
            sceneItemTypeVariation: sceneItem.sceneItemTypeVariation,
            tileId: sceneItem.tileId
        }))
        
        return sceneItemsData;
    }
}