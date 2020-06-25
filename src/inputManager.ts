import { MapEditor } from "./mapEditor";

export class InputManager {
    private _mapEditor: MapEditor;
    private _mousePressed: boolean
    private _mouseCurrentPositionX: number
    private _mouseCurrentPositionY: number
    private _spaceBarPressed: boolean

    constructor(mapEditor: MapEditor) {
        this._mapEditor = mapEditor
        this._mousePressed = false
        this._mouseCurrentPositionX = 0
        this._mouseCurrentPositionY = 0
        this._spaceBarPressed = false
    }

    private onMouseMove(event: MouseEvent): void {
        event.preventDefault()
        let rect = this._mapEditor.canvas.htmlElement.getBoundingClientRect();
        let mousePosX = event.clientX-rect.left
        let mousePosY = event.clientY-rect.top
        var distanceMovedX = this._mouseCurrentPositionX-mousePosX
        var distanceMovedY = this._mouseCurrentPositionY-mousePosY
        this._mouseCurrentPositionX = mousePosX
        this._mouseCurrentPositionY = mousePosY
        if (this._mousePressed) {
            if (this._spaceBarPressed) {
                this._mapEditor.canvas.offsetX += distanceMovedX
                this._mapEditor.canvas.offsetY += distanceMovedY
            }
            else {
                let clickedGridSquare = this._mapEditor.getTileInPosition(mousePosX, mousePosY)
                if (this._mapEditor.selectedTileTypeId != 0) this._mapEditor.changeTileType(clickedGridSquare)
            }
        }
    }
    
    private onMouseDown(event: MouseEvent): void {
        event.preventDefault()
        this._mousePressed = true
        let rect = this._mapEditor.canvas.htmlElement.getBoundingClientRect();
        let clickX = event.clientX-rect.left
        let clickY = event.clientY-rect.top
        if (!this._spaceBarPressed) {
            let clickedTile = this._mapEditor.getTileInPosition(clickX, clickY)
    
            if (this._mapEditor.selectedTileTypeId != 0) {
                this._mapEditor.changeTileType(clickedTile)
            }
            else if (this._mapEditor.selectedSceneItemTypeId != 0) {
                this._mapEditor.addSceneItemToTile(clickedTile)
            }
            else {
                this._mapEditor.clearTile(clickedTile)
            }
        }
    }
    
    private onMouseUp(event: MouseEvent): void {
        event.preventDefault()
        this._mousePressed = false
    }
    
    private onKeyDown(event: KeyboardEvent): void {
        switch (event.keyCode) {
            case 32:
                event.preventDefault()
                this._spaceBarPressed = true
                document.body.style.cursor = 'grab'
                break
            case 27:
                event.preventDefault()
                this._mapEditor.deselectAll()
                break
            case 69:
                event.preventDefault()
                this._mapEditor.selectTileType(0, 0)
        }
    }
    
    private onKeyUp(event: KeyboardEvent): void {
        event.preventDefault()
        if (event.keyCode == 32) {
            this._spaceBarPressed = false
            document.body.style.cursor = "default"
        }
    }
    
    private onMouseOut(event: MouseEvent): void {
        this._mouseCurrentPositionX = 0
        this._mouseCurrentPositionY = 0
    }

    public registerEvents() {
        this._mapEditor.canvas.htmlElement.oncontextmenu = function (event) { event.preventDefault() }
        this._mapEditor.canvas.htmlElement.onmousedown = this.onMouseDown.bind(this)
        this._mapEditor.canvas.htmlElement.onclick = this.onMouseUp.bind(this)
        this._mapEditor.canvas.htmlElement.onmousemove = this.onMouseMove.bind(this)
        this._mapEditor.canvas.htmlElement.onmouseout = this.onMouseOut.bind(this)
        document.body.onkeydown = this.onKeyDown.bind(this)
        document.body.onkeyup = this.onKeyUp.bind(this)
    }

    /* #region Getters and Setters */
    get mouseCurrentPositionX(): number {
        return this._mouseCurrentPositionX
    }
    
    get mouseCurrentPositionY(): number {
        return this._mouseCurrentPositionY
    }
    /* #endregion */
}