import { SceneItem } from "../model/sceneItem";
import { SceneItemType } from "../model/sceneItemType";

export class SceneItemTypeController {
    private static instance: SceneItemTypeController
    private _sceneItemTypes: Array<SceneItemType>
    private _sceneItemTypesIdCounter: number = 0

    private constructor() {
        this._sceneItemTypes = new Array<SceneItemType>()
    }

    get sceneItemTypes() : Array<SceneItemType> {
        return this._sceneItemTypes;
    }

    public static getInstance(): SceneItemTypeController {
        if (!SceneItemTypeController.instance) {
            SceneItemTypeController.instance = new SceneItemTypeController()
        }

        return SceneItemTypeController.instance
    }

    public createSceneItemType(): SceneItemType {
        this._sceneItemTypesIdCounter++;
        return new SceneItemType(this._sceneItemTypesIdCounter)
    }

    public loadSceneItemTypes(): void {
        let sceneItemTypesData = require('../database/sceneItemType')
        for (let sceneItemTypeData of sceneItemTypesData) {
            let sceneItemType = new SceneItemType(sceneItemTypeData.id)
            sceneItemType.name = sceneItemTypeData.name
            sceneItemType.collision = sceneItemTypeData.collision
            this._sceneItemTypes.push(sceneItemType)
        }
    }

    public findSceneItemType(sceneItemTypeId: number): SceneItemType {
        let existingSceneItemType: SceneItemType
        for (let sceneItemType of this._sceneItemTypes) {
            if (sceneItemType.id == sceneItemTypeId) {
                existingSceneItemType = sceneItemType
                break;
            }
        }
        return existingSceneItemType
    }

}