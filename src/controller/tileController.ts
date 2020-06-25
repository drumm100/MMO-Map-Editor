import { Tile } from "../model/tile";

export class TileController {
    private static instance: TileController
    private _tiles: Array<Tile>

    private constructor() {
        this._tiles = new Array<Tile>()
    }

    public static getInstance(): TileController {
        if (!TileController.instance) {
            TileController.instance = new TileController()
        }

        return TileController.instance
    }
}