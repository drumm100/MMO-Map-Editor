import { MapEditor } from "../mapEditor";
import { Tile } from "../model/tile";
import { TileType } from "../model/tileType";

export class TileTypeController {
    private static instance: TileTypeController
    private _tileTypes: Array<TileType>
    private _mapEditor: MapEditor

    private constructor(mapEditor : MapEditor) {
        this._mapEditor = mapEditor;
        this._tileTypes = new Array<TileType>()
    }

    get tileTypes() : Array<TileType> {
        return this._tileTypes;
    }

    public static getInstance(mapEditor : MapEditor): TileTypeController {
        if (!TileTypeController.instance) {
            TileTypeController.instance = new TileTypeController(mapEditor)
        }

        return TileTypeController.instance
    }

    public changeTileType(tile: Tile): void {

        let tileType = this.findTileType(this._mapEditor.selectedTileTypeId)
        tile.tileType = tileType
        let tileTypeVariation = this._mapEditor.selectedTileTypeVariation
        if (tileType.name == 'grass_tile' && this._mapEditor.selectedTileTypeVariation == 0) {
            if (this.percentageCheck(3)) {
                tileTypeVariation = Math.floor(Math.random() * (20 - 13)) + 13
            }
            else if (this.percentageCheck(80)) {
                tileTypeVariation = Math.floor(Math.random() * (38 - 21)) + 21
            }
        }
        else if (tileType.name == 'wood_plank' && this._mapEditor.selectedTileTypeVariation == 0) {
            tileTypeVariation = Math.floor(Math.random() * (6 - 0)) + 0
        }
        tile.tileTypeVariation = tileTypeVariation
    }

    public findTileType(tileTypeId: number): TileType {
        let existingTileType: TileType
        for (let tileType of this._tileTypes) {
            if (tileType.id == tileTypeId) {
                existingTileType = tileType
                break;
            }
        }
        return existingTileType
    }

    public loadTileTypes(): void {
        let tileTypesData = require('../database/tileType')
        for (let tileTypeData of tileTypesData) {
            let tileType = new TileType(tileTypeData.id, tileTypeData.name)
            this._tileTypes.push(tileType)
        }
    }

    private percentageCheck(percentage: number): boolean {
        return Math.floor((Math.random() * 100) + 1) <= percentage
    }

}