import { Tile } from "../model/tile";

export class TilesDTO {
    private _tiles: Array<Tile>;

    constructor(tiles: Array<Tile>) {
        this._tiles = tiles;
    }

    public toJSON() {
        let tilesData = this._tiles.map(tile => ({
            id: tile.id,
            x: tile.coordinate.x,
            y: tile.coordinate.y,
            z: tile.coordinate.z,
            tileTypeId: tile.tileTypeId,
            tileTypeVariation: tile.tileTypeVariation
        }))
        
        return tilesData;
    }
}