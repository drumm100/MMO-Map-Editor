import { SpriteManager } from "./spriteManager";
import { Tile } from "./model/tile";
import { SceneItem } from "./model/sceneItem";
import { Canvas } from "./canvas";
import { TileType } from "./model/tileType";
import { InputManager } from "./inputManager";
import { SceneItemType } from "./model/sceneItemType";
import { Coordinate } from "./coordinate";
import { TilesDTO } from "./dto/tiles.dto";
import { SceneItemsDTO } from "./dto/sceneItems.dto";

export class MapEditor {
    private _spriteManager: SpriteManager
    private _inputManager: InputManager
    private _canvas: Canvas

    private _tiles: Array<Tile>
    private _tileTypes: Array<TileType>
    private _sceneItems: Array<SceneItem>
    private _sceneItemTypes: Array<SceneItemType>

    private _selectedTileTypeId: number
    private _selectedTileTypeVariation: number
    private _selectedSceneItemTypeId: number
    private _selectedSceneItemTypeVariation: number

    constructor() {
        this._spriteManager = new SpriteManager('./assets/')
        this._inputManager = new InputManager(this)
        this._canvas = new Canvas('world-map')
        this._tiles = new Array<Tile>()
        this._tileTypes = new Array<TileType>()
        this._sceneItems = new Array<SceneItem>()
        this._sceneItemTypes = new Array<SceneItemType>()
        this._selectedTileTypeId = 0
        this._selectedTileTypeVariation = 0
        this._selectedSceneItemTypeId = 0
        this._selectedSceneItemTypeVariation = 0

        this.start()
    }

    /* #region Getters and Setters */
    get canvas(): Canvas {
        return this._canvas;
    }

    get selectedTileTypeId(): number {
        return this._selectedTileTypeId;
    }

    get selectedTileTypeVariation(): number {
        return this._selectedTileTypeVariation
    }

    get selectedSceneItemTypeId(): number {
        return this._selectedSceneItemTypeId;
    }

    get selectedSceneItemTypeVariation(): number {
        return this._selectedSceneItemTypeVariation;
    }
    /* #endregion */

    private loadTileTypes(): void {
        let tileTypesData = require('./database/tileType')
        for (let tileTypeData of tileTypesData) {
            let tileType = new TileType(tileTypeData.id, tileTypeData.name)
            this._tileTypes.push(tileType)
        }
    }

    private loadSceneItemTypes(): void {
        let sceneItemTypesData = require('./database/sceneItemType')
        for (let sceneItemTypeData of sceneItemTypesData) {
            let sceneItemType = new SceneItemType(sceneItemTypeData.id, sceneItemTypeData.name, sceneItemTypeData.collision)
            this._sceneItemTypes.push(sceneItemType)
        }
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

    private enableExportMapButton(): void {
        let exportMapButton = document.getElementById('exportMapButton')
        exportMapButton.addEventListener('click', this.exportMap.bind(this));
    }
    
    private percentageCheck(percentage: number): boolean {
        return Math.floor((Math.random() * 100) + 1) <= percentage
    }

    private populateTileMenu(): void {
        let tileTypeMenu = document.getElementById('menu')
        for (let i = 0; i < this._tileTypes.length; i++) {
            let variationsFolder = document.createElement('ul')
            variationsFolder.classList.add('section')
            variationsFolder.classList.add('collapsible')
            variationsFolder.id = `tile-type-variation-folder-${this._tileTypes[i].id}`
            let variations = this._spriteManager.getSpriteVariations(this._tileTypes[i].name)
            for (let j = 0; j < variations; j++) {
                let sprite = this._spriteManager.getSprite(this._tileTypes[i].name, j)
    
                let div = document.createElement('div')
                div.addEventListener("click", (e:Event) => this.selectTileType(this._tileTypes[i].id, j));
    
                let img = document.createElement('img')
                img.src = sprite.sheet.image.src
                img.style.marginLeft = -sprite.x+'px'
                img.style.marginTop = -sprite.y+'px'
    
                div.appendChild(img)
                variationsFolder.appendChild(div)
            }
            tileTypeMenu.appendChild(variationsFolder)
        }
    }

    private populateSceneItemMenu(): void {
        //TODO: alterar para respectivo menu
        let sceneItemMenu = document.getElementById('menu')
        for (let i = 0; i < this._sceneItemTypes.length; i++) {
            let variationsFolder = document.createElement('ul')
            variationsFolder.classList.add('section')
            variationsFolder.classList.add('collapsible')
            variationsFolder.id = `scene-item-type-variation-folder-${this._sceneItemTypes[i].id}`
            let variations = this._spriteManager.getSpriteVariations(this._sceneItemTypes[i].name)
            for (let j = 0; j < variations; j++) {
                let sprite = this._spriteManager.getSprite(this._sceneItemTypes[i].name, j)
                
                let div = document.createElement('div')
                div.addEventListener("click", (e:Event) => this.selectSceneItemType(this._sceneItemTypes[i].id, j));
                
                let img = document.createElement('img')
                img.src = sprite.sheet.image.src
                img.style.marginLeft = -sprite.x+'px'
                img.style.marginTop = -sprite.y+'px'
                
                div.appendChild(img)
                variationsFolder.appendChild(div)
            }
            sceneItemMenu.appendChild(variationsFolder)
        }
    }

    private createWorldMap(width: number, height: number): void {
        let waterTileType = this.findTileType(1)
        let sprite = this._spriteManager.getSprite('water', 0)
        let id = 0;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                let coordinate = new Coordinate(i, j, 0)
                let tile = new Tile(id, coordinate, waterTileType, 0, sprite)
                this._tiles.push(tile)
                id++
            }
        }
        console.log(this._tiles.length)
    }

    private selectSceneItemType(id: number, variation: number): void {
        document.body.style.cursor = 'default'
    
        for (let i = 0; i < this._sceneItemTypes.length; i++) {
            let variationsFolder = document.getElementById(`scene-item-type-variation-folder-${this._sceneItemTypes[i].id}`)
            if (this._sceneItemTypes[i].id == id) {
                this.expandSection(variationsFolder)
            }
            else {
                this.collapseSection(variationsFolder)
            }
        }
        this._selectedSceneItemTypeId = id
        this._selectedSceneItemTypeVariation = variation
    
        this._selectedTileTypeId = 0
    }

    private downloadJson(json: any, fileName: string, downloadAnchor: HTMLLinkElement) {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', fileName);
        downloadAnchor.click();
    }

    private async start() {
        await this._spriteManager.preload()
        this.loadTileTypes()
        this.loadSceneItemTypes()
        console.log('Loading complete.');
        this._canvas.setToFullScreen()
        this._inputManager.registerEvents()
        this.populateTileMenu()
        this.populateSceneItemMenu()
        this.selectTileType(0, 0)
        this.selectSceneItemType(0, 0)
        this.createWorldMap(100, 100)
        this.enableExportMapButton()
        
        setInterval((e:Event) => this._canvas.draw(this, this._spriteManager, this._inputManager), 16)
        console.log('Starting...');
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
        let tileX = Math.floor((clickX+this._canvas.offsetX)/this._canvas.tileWidthPx)
        let tileY = Math.floor((clickY+this._canvas.offsetY)/this._canvas.tileHeightPx)
        for (let tile of this._tiles) {
            if (tile.coordinate.x == tileX && tile.coordinate.y == tileY) {
                existingTile = tile
                break
            }
        }
        return existingTile
    }

    public changeTileType(tile: Tile): void {
        let tileType = this.findTileType(this._selectedTileTypeId)
        tile.tileType = tileType
        let tileTypeVariation = this._selectedTileTypeVariation
        if (tileType.name == 'grass_tile' && this._selectedTileTypeVariation == 0) {
            if (this.percentageCheck(3)) {
                tileTypeVariation = Math.floor(Math.random() * (20 - 13)) + 13
            }
            else if (this.percentageCheck(80)) {
                tileTypeVariation = Math.floor(Math.random() * (38 - 21)) + 21
            }
        }
        else if (tileType.name == 'wood_plank' && this._selectedTileTypeVariation == 0) {
            tileTypeVariation = Math.floor(Math.random() * (6 - 0)) + 0
        }
        tile.tileTypeVariation = tileTypeVariation
    }

    public addSceneItemToTile(tile: Tile): void {
        let sceneItemType = this.findSceneItemType(this._selectedSceneItemTypeId)
        let sprite = this._spriteManager.getSprite(sceneItemType.name, this._selectedSceneItemTypeVariation)
        let sceneItem = new SceneItem(
            this._sceneItems.length,
            sceneItemType,
            sprite,
            this._selectedSceneItemTypeVariation,
            tile
        )
        this._sceneItems.push(sceneItem)
        tile.sceneItems.push(sceneItem)
    }

    public clearTile(tile: Tile): void {
        tile.sceneItems = []
        for (let i = 0; i < this._sceneItems.length; i++) {
            if (this._sceneItems[i].tileId == tile.id) {
                this._sceneItems.splice(i, 1)
                i--
            }
        }
    }

    public selectTileType(id: number, variation: number): void {
        if (id == 0)
            document.body.style.cursor = 'not-allowed'
        else
            document.body.style.cursor = 'default'

        for (let i = 0; i < this._tileTypes.length; i++) {
            let variationsFolder = document.getElementById(`tile-type-variation-folder-${this._tileTypes[i].id}`)
            if (this._tileTypes[i].id == id) {
                this.expandSection(variationsFolder)
            }
            else {
                this.collapseSection(variationsFolder)
            }
        }
        this._selectedTileTypeId = id
        this._selectedTileTypeVariation = variation
        this._selectedSceneItemTypeId = 0
    }

    public deselectAll(): void {
        this._selectedSceneItemTypeId = 0
        this._selectedSceneItemTypeVariation = 0
        this._selectedTileTypeId = 0
        this._selectedTileTypeVariation = 0
    }

    public collapseSection(element: HTMLElement): void {
        if (element.getAttribute('data-collapsed') === 'false' || element.getAttribute('data-collapsed') == null) {
            element.setAttribute('data-collapsed', 'true');
            var sectionHeight = element.scrollHeight;
            
            var elementTransition = element.style.transition;
            element.style.transition = '';
            
            requestAnimationFrame(function() {
                element.style.height = sectionHeight + 'px';
                element.style.transition = elementTransition;
                
                requestAnimationFrame(function() {
                    let firstElementStyle = getComputedStyle(element.firstElementChild)
                    let minHeightPx = parseInt(firstElementStyle.height) + parseInt(firstElementStyle.margin)*2;
                    element.style.height = minHeightPx+'px';
                });
            });
        }
    }
      
    public expandSection(element: HTMLElement): void {
        if (element.getAttribute('data-collapsed') === 'true' || element.getAttribute('data-collapsed') == null) {
            element.setAttribute('data-collapsed', 'false');
            var sectionHeight = element.scrollHeight;
    
            element.style.height = sectionHeight-10 + 'px';
    
            element.addEventListener('transitionend', function handler(e) {
                element.removeEventListener('transitionend', handler);
                
                element.style.height = null;
            });
        }
    }
    
    public exportMap(): void {
        let tilesDto = new TilesDTO(this._tiles)
        let tilesJson = tilesDto.toJSON()
        let downloadTilesAnchor = <HTMLLinkElement>document.getElementById('downloadTilesAnchor')
        this.downloadJson(tilesJson, "tiles.json", downloadTilesAnchor)
    
        let sceneItemsDto = new SceneItemsDTO(this._sceneItems)
        let sceneItemsJson = sceneItemsDto.toJSON()
        let downloadSceneItemsAnchor = <HTMLLinkElement>document.getElementById('downloadSceneItemsAnchor')
        this.downloadJson(sceneItemsJson, "sceneItems.json", downloadSceneItemsAnchor)
    }
}