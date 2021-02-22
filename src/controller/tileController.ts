import { Coordinate } from "../coordinate";
import { MapEditor } from "../mapEditor";
import { Tile } from "../model/tile";

export class TileController {
    private static instance: TileController;
    private _tiles: Array<Tile>;
    private _mapEditor: MapEditor;
    
    private constructor(mapEditor : MapEditor) {
        this._mapEditor = mapEditor;
        this._tiles = new Array<Tile>();
    }

    public static getInstance(mapEditor : MapEditor): TileController {
        if (!TileController.instance) {
            TileController.instance = new TileController(mapEditor)
        }

        return TileController.instance;
    }

    get tiles() : Array<Tile> {
        return this._tiles;
    }


    public createWorldMap(width: number, height: number): void {
        let waterTileType = this._mapEditor.tileTypeController.findTileType(1)
        let sprite = this._mapEditor.spriteManager.getSprite('water', 0)
        let id = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let coordinate = new Coordinate(i, j, 0)
                let tile = new Tile(id, coordinate, waterTileType, 0, sprite)
                this._tiles.push(tile)
                id++
            }
        }
    }

    public getTileInCoordinate(coordinate: Coordinate): Tile {
        let existingTile: Tile;
        for (let tile of this._tiles) {
            if (tile.coordinate.x == coordinate.x &&
                tile.coordinate.y == coordinate.y &&
                tile.coordinate.z == coordinate.z
            ) {
                existingTile = tile
                break
            }
        }
        return existingTile
    }

    public getTileInPosition(clickX: number, clickY: number): Tile {
        let existingTile: Tile;
        let tileX = Math.floor((clickX+this._mapEditor.canvas.offsetX)/this._mapEditor.canvas.tileWidthPx)
        let tileY = Math.floor((clickY+this._mapEditor.canvas.offsetY)/this._mapEditor.canvas.tileHeightPx)
        for (let tile of this._tiles) {
            if (tile.coordinate.x == tileX && tile.coordinate.y == tileY) {
                existingTile = tile
                break
            }
        }
        return existingTile
    }

    public clearTile(tile: Tile): void {
        let sceneItem = this._mapEditor.sceneItemController.sceneItems
        tile.sceneItems = []
        for (let i = 0; i < sceneItem.length; i++) {
            if (sceneItem[i].tileId == tile.id) {
                sceneItem.splice(i, 1)
                i--
            }
        }
        
    }

    public addSceneItemToTile(tile: Tile): void {
        let sceneItemType = this._mapEditor.sceneItemTypeController.findSceneItemType(this._mapEditor.selectedSceneItemTypeId)
        let sprite = this._mapEditor.spriteManager.getSprite(sceneItemType.name, this._mapEditor.selectedSceneItemTypeVariation)
        let sceneItem = this._mapEditor.sceneItemController.createSceneItem();
        sceneItem.sceneItemType = sceneItemType;
        sceneItem.sprite = sprite;
        sceneItem.sceneItemTypeVariation = this._mapEditor.selectedSceneItemTypeVariation;
        sceneItem.tile = tile;
        sceneItem.tileId = tile.id;
        
        tile.sceneItems.push(sceneItem)
    }


}