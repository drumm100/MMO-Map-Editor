import { SpriteManager } from "./spriteManager";
import { Canvas } from "./canvas";
import { InputManager } from "./inputManager";
import { TilesDTO } from "./dto/tiles.dto";
import { SceneItemsDTO } from "./dto/sceneItems.dto";
import { SceneItemController } from "./controller/sceneItemController";
import { TileController } from "./controller/tileController";
import { TileTypeController } from "./controller/tileTypeController";
import { SceneItemTypeController } from "./controller/sceneItemTypeController";

export class MapEditor {
    private _spriteManager: SpriteManager
    private _inputManager: InputManager
    private _canvas: Canvas

    private _selectedTileTypeId: number
    private _selectedTileTypeVariation: number
    private _selectedSceneItemTypeId: number
    private _selectedSceneItemTypeVariation: number

    private _sceneItemController = SceneItemController.getInstance();
    private _sceneItemTypeController = SceneItemTypeController.getInstance();
    private _tileController = TileController.getInstance(this);
    private _tileTypeController = TileTypeController.getInstance(this);

    constructor() {
        this._spriteManager = new SpriteManager('./assets/')
        this._inputManager = new InputManager(this)
        this._canvas = new Canvas('world-map')
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

    get sceneItemController(): SceneItemController {
        return this._sceneItemController
    }

    get sceneItemTypeController(): SceneItemTypeController {
        return this._sceneItemTypeController
    }

    get tileController(): TileController {
        return this._tileController
    }

    get tileTypeController(): TileTypeController {
        return this._tileTypeController
    }

    get spriteManager(): SpriteManager {
        return this._spriteManager;
    }
    /* #endregion */

    private enableExportMapButton(): void {
        let exportMapButton = document.getElementById('exportMapButton')
        exportMapButton.addEventListener('click', this.exportMap.bind(this));
    }
    
    private populateTileMenu(): void {
        let tileTypes = this._tileTypeController.tileTypes;
        let tileTypeMenu = document.getElementById('menu')
        for (let i = 0; i < tileTypes.length; i++) {
            let variationsFolder = document.createElement('ul')
            variationsFolder.classList.add('section')
            variationsFolder.classList.add('collapsible')
            variationsFolder.id = `tile-type-variation-folder-${tileTypes[i].id}`
            let variations = this._spriteManager.getSpriteVariations(tileTypes[i].name)
            for (let j = 0; j < variations; j++) {
                let sprite = this._spriteManager.getSprite(tileTypes[i].name, j)
    
                let div = document.createElement('div')
                div.addEventListener("click", (e:Event) => this.selectTileType(tileTypes[i].id, j));
    
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
        let sceneItemsTypes = this._sceneItemTypeController.sceneItemTypes;
        let sceneItemMenu = document.getElementById('menu')
        for (let i = 0; i < sceneItemsTypes.length; i++) {
            let variationsFolder = document.createElement('ul')
            variationsFolder.classList.add('section')
            variationsFolder.classList.add('collapsible')
            variationsFolder.id = `scene-item-type-variation-folder-${sceneItemsTypes[i].id}`
            let variations = this._spriteManager.getSpriteVariations(sceneItemsTypes[i].name)
            for (let j = 0; j < variations; j++) {
                let sprite = this._spriteManager.getSprite(sceneItemsTypes[i].name, j)
                
                let div = document.createElement('div')
                div.addEventListener("click", (e:Event) => this.selectSceneItemType(sceneItemsTypes[i].id, j));
                
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

    private selectSceneItemType(id: number, variation: number): void {
        document.body.style.cursor = 'default'
        let sceneItemsTypes = this._sceneItemTypeController.sceneItemTypes;

        for (let i = 0; i < sceneItemsTypes.length; i++) {
            let variationsFolder = document.getElementById(`scene-item-type-variation-folder-${sceneItemsTypes[i].id}`)
            if (sceneItemsTypes[i].id == id) {
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
        this._tileTypeController.loadTileTypes()
        this._sceneItemTypeController.loadSceneItemTypes()
        console.log('Loading complete.');
        this._canvas.setToFullScreen()
        this._inputManager.registerEvents()
        this.populateTileMenu()
        this.populateSceneItemMenu()
        this.selectTileType(0, 0)
        this.selectSceneItemType(0, 0)
        this._tileController.createWorldMap(100, 100)
        this.enableExportMapButton()
        
        setInterval((e:Event) => this._canvas.draw(this, this._spriteManager, this._inputManager), 16)
        console.log('Starting...');
    }

    public selectTileType(id: number, variation: number): void {
        let tileType = this._tileTypeController.tileTypes;

        if (id == 0)
            document.body.style.cursor = 'not-allowed'
        else
            document.body.style.cursor = 'default'

        for (let i = 0; i < tileType.length; i++) {
            let variationsFolder = document.getElementById(`tile-type-variation-folder-${tileType[i].id}`)
            if (tileType[i].id == id) {
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
        let tiles = this._tileController.tiles;
        let sceneItems = this._sceneItemController.sceneItems;

        let tilesDto = new TilesDTO(tiles)
        let tilesJson = tilesDto.toJSON()
        let downloadTilesAnchor = <HTMLLinkElement>document.getElementById('downloadTilesAnchor')
        this.downloadJson(tilesJson, "tiles.json", downloadTilesAnchor)
    
        let sceneItemsDto = new SceneItemsDTO(sceneItems)
        let sceneItemsJson = sceneItemsDto.toJSON()
        let downloadSceneItemsAnchor = <HTMLLinkElement>document.getElementById('downloadSceneItemsAnchor')
        this.downloadJson(sceneItemsJson, "sceneItems.json", downloadSceneItemsAnchor)
    }
}