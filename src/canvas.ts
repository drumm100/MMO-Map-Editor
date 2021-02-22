import { MapEditor } from "./mapEditor"
import { Coordinate } from "./coordinate"
import { SpriteManager } from "./spriteManager"
import { InputManager } from "./inputManager"

export class Canvas {
    private _htmlElement: HTMLCanvasElement
    private _offsetX: number
    private _offsetY: number
    private _spritesResolution: number
    private _tileWidthPx: number
    private _tileHeightPx: number

    constructor(canvasElementId: string) {
        this._htmlElement = <HTMLCanvasElement>document.getElementById(canvasElementId)
        this._offsetX = 0
        this._offsetY = 0
        this._spritesResolution = 2
        this._tileWidthPx = 64
        this._tileHeightPx = 64
    }

    /* #region Getters and Setters */
    get htmlElement(): HTMLCanvasElement {
        return this._htmlElement
    }

    get offsetX(): number {
        return this._offsetX
    }

    get offsetY(): number {
        return this._offsetY
    }

    get tileWidthPx(): number {
        return this._tileWidthPx
    }

    get tileHeightPx(): number {
        return this._tileHeightPx
    }

    set offsetX(value: number) {
        this._offsetX = value
    }

    set offsetY(value: number) {
        this._offsetY = value
    }
    /* #endregion */

    public setToFullScreen(): void {
        this._htmlElement.style.width = '100%'
        this._htmlElement.style.height = '100%'
        this._htmlElement.width = this._htmlElement.offsetWidth
        this._htmlElement.height = this._htmlElement.offsetHeight
    }

    public draw(mapEditor: MapEditor, spriteManager: SpriteManager, inputManager: InputManager): void {
        var ctx = this._htmlElement.getContext('2d')
        ctx.clearRect(0, 0, this._htmlElement.width, this._htmlElement.height)
    
        let startingPointI = Math.max(Math.floor(this._offsetX/this._tileWidthPx), 0)
        let startingPointJ = Math.max(Math.floor(this._offsetY/this._tileHeightPx), 0)
        let endingPointI = Math.floor(this._htmlElement.width/this._tileWidthPx)+startingPointI+1
        let endingPointJ = Math.floor(this._htmlElement.height/this._tileHeightPx)+startingPointJ+2
    
        let i = startingPointI
        let j = startingPointJ
        while (j < endingPointJ) {
            let coordinate = new Coordinate(i, j, 0)
            let tile = mapEditor.tileController.getTileInCoordinate(coordinate)
            if (i*this.tileWidthPx >= this._offsetX-this.tileWidthPx && i*this.tileWidthPx < this._offsetX+this.htmlElement.width &&
                j*this._tileHeightPx >= this._offsetY-this._tileHeightPx && j*this._tileHeightPx < this._offsetY+this.htmlElement.height) {
                let tileTypeId = tile.tileType.name
                let tileTypeVariation = tile.tileTypeVariation
                let sprite = spriteManager.getSprite(tileTypeId, tileTypeVariation)
                ctx.drawImage(
                    sprite.sheet.image,
                    // Cut image
                    sprite.x,
                    sprite.y,
                    sprite.width,
                    sprite.height,
                    // Canvas position
                    i*this.tileWidthPx-this._offsetX+(this.tileWidthPx/2-sprite.offsetX),
                    j*this._tileHeightPx-this._offsetY+(this._tileHeightPx/2-sprite.offsetY),
                    sprite.width,
                    sprite.height
                );
    
                ctx.strokeStyle  = "rgba(0, 0, 0, 0.1)";
                ctx.beginPath()
                ctx.rect(i*this.tileWidthPx-this._offsetX, j*this._tileHeightPx-this._offsetY, this.tileWidthPx, this._tileHeightPx)
                ctx.stroke()
            }
            
            if (i !== startingPointI && i%endingPointI == 0) {
                j++
                i = startingPointI
            }
            else {
                i++
            }
        }
        j = startingPointJ;
        while (j < endingPointJ) {
            let coordinate = new Coordinate(i, j, 0)
            let tile = mapEditor.tileController.getTileInCoordinate(coordinate)
            for (let k = 0; k < tile.sceneItems.length; k++) {
                if (i*this.tileWidthPx >= this._offsetX-this.tileWidthPx && i*this.tileWidthPx < this._offsetX+this._htmlElement.width &&
                    j*this._tileHeightPx >= this._offsetY-this._tileHeightPx && j*this._tileHeightPx < this._offsetY+this.htmlElement.height) {
                    
                    let sceneItemTypeId = tile.sceneItems[k].sceneItemType.name
                    let sceneItemTypeVariation = tile.sceneItems[k].sceneItemTypeVariation
                    let sprite = spriteManager.getSprite(sceneItemTypeId, sceneItemTypeVariation)
                    ctx.drawImage(
                        sprite.sheet.image,
                        // Cut image
                        sprite.x,
                        sprite.y,
                        sprite.width,
                        sprite.height,
                        // Canvas position
                        i*this.tileWidthPx-this._offsetX+(this.tileWidthPx/2-sprite.offsetX),
                        j*this._tileHeightPx-this._offsetY+(this._tileHeightPx/2-sprite.offsetY),
                        sprite.width,
                        sprite.height
                    );
                }
            }
            if (i !== startingPointI && i%endingPointI == 0) {
                j++
                i = startingPointI
            }
            else {
                i++
            }
        }
        
        if (inputManager.mouseCurrentPositionX != 0 || inputManager.mouseCurrentPositionY != 0) {
            let gridSquareX = Math.floor((inputManager.mouseCurrentPositionX+this._offsetX)/this.tileWidthPx)
            let gridSquareY = Math.floor((inputManager.mouseCurrentPositionY+this._offsetY)/this._tileHeightPx)
            let gridSquarePositionX = gridSquareX*this.tileWidthPx-this._offsetX
            let gridSquarePositionY = gridSquareY*this._tileHeightPx-this._offsetY
            
            if (mapEditor.selectedTileTypeId != 0) {
                let tileType = mapEditor.tileTypeController.findTileType(mapEditor.selectedTileTypeId)
                let sprite = spriteManager.getSprite(tileType.name, mapEditor.selectedTileTypeVariation)
                ctx.drawImage(
                    sprite.sheet.image,
                    // Cut image
                    sprite.x,
                    sprite.y,
                    sprite.width,
                    sprite.height,
                    // Canvas position
                    gridSquarePositionX,
                    gridSquarePositionY,
                    sprite.width,
                    sprite.height
                );
            }
            else if (mapEditor.selectedSceneItemTypeId != 0) {
                let sceneItemType = mapEditor.sceneItemTypeController.findSceneItemType(mapEditor.selectedSceneItemTypeId)
                let sprite = spriteManager.getSprite(sceneItemType.name, mapEditor.selectedSceneItemTypeVariation)
                ctx.drawImage(
                    sprite.sheet.image,
                    // Cut image
                    sprite.x,
                    sprite.y,
                    sprite.width,
                    sprite.height,
                    // Canvas position
                    gridSquarePositionX+(this.tileWidthPx/2-sprite.offsetX),
                    gridSquarePositionY+(this._tileHeightPx/2-sprite.offsetY),
                    sprite.width,
                    sprite.height
                );
            }
            ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
            ctx.beginPath()
            ctx.rect(gridSquarePositionX, gridSquarePositionY, this.tileWidthPx, this._tileHeightPx)
            ctx.stroke()
        }
    }
}