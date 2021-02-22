import { SceneItem } from "../model/sceneItem";

export class SceneItemController {
    private static instance: SceneItemController
    private _sceneItems: Array<SceneItem>
    private _sceneItemsIdCounter : number = 0

    private constructor() {
        this._sceneItems = new Array<SceneItem>()
    }

    get sceneItems(): Array<SceneItem> {
        return this._sceneItems;
    }

    public static getInstance(): SceneItemController {
        if (!SceneItemController.instance) {
            SceneItemController.instance = new SceneItemController()
        }

        return SceneItemController.instance
    }

    public createSceneItem(): SceneItem {
        this._sceneItemsIdCounter++;
        let sceneItem =  new SceneItem(this._sceneItemsIdCounter);
        this._sceneItems.push(sceneItem);
        return sceneItem;
    }
}