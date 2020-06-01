var selectedTileType = null
var selectedTileTypeVariation = 0

var selectedSceneItemType = null
var selectedSceneItemTypeVariation = 0

var tileTypes = [{
    id: 1,
    name: 'water',
    tileTypeVariations: 1,
    sprites: []
}, {
    id: 2,
    name: 'grass',
    tileTypeVariations: 13,
    sprites: []
}, {
    id: 3,
    name: 'sand',
    tileTypeVariations: 1,
    sprites: []
}, {
    id: 4,
    name: 'wood-plank',
    tileTypeVariations: 1,
    sprites: []
}]

var sceneItemTypes = [{
    id: 9,
    name: 'tree',
    sceneItemTypeVariations: 1,
    sprites: []
}]

var mousePressed = false;
var mouseCurrentPositionX = 0;
var mouseCurrentPositionY = 0;
var spaceBarPressed = false;
var gridSquareWidthPx = 64;
var gridSquareHeightPx = 64;
var canvasOffsetX = 0;
var canvasOffsetY = 0;
var worldMap = [];
var canvas = null

function getTileTypeById(id) {
    let tileType
    for(let i = 0; i < tileTypes.length; i++) {
        if(tileTypes[i].id === id) {
            tileType = tileTypes[i]
            break
        }
    }
    return tileType
}

//TODO: conferir necessidade dessa função
function getTileTypeByName(name) {
    let tileType
    for(let i = 0; i < tileTypes.length; i++) {
        if(tileTypes[i].name === name) {
            tileType = tileTypes[i]
            break
        }
    }
    return tileType
}

function getSceneItemTypeById(id) {
    let sceneItemType
    for(let i = 0; i < sceneItemTypes.length; i++) {
        if(sceneItemTypes[i].id === id) {
            sceneItemType = sceneItemTypes[i]
            break
        }
    }
    return sceneItemType
}

function populateTileMenu() {
    let tileTypeMenu = document.getElementById('tile-type-menu')
    for (let i = 0; i < tileTypes.length; i++) {
        let variationsFolder = document.createElement('ul')
        variationsFolder.id = `tile-type-variation-folder-${tileTypes[i].id}`
        for (let j = 0; j < tileTypes[i].tileTypeVariations; j++) {

            let li = document.createElement('li')
            li.setAttribute('onClick', 'selectTileType('+tileTypes[i].id+', '+j+')')
            
            let img = document.createElement('img')
            img.src = 'assets/'+tileTypes[i].name+'/'+j+'.png'

            li.appendChild(img)
            variationsFolder.appendChild(li)
        }
        tileTypeMenu.appendChild(variationsFolder)
    }
}

function populateSceneItemMenu() {
    //TODO: alterar para respectivo menu
    let sceneItemMenu = document.getElementById('tile-type-menu')
    for (let i = 0; i < sceneItemTypes.length; i++) {
        let variationsFolder = document.createElement('ul')
        variationsFolder.id = `scene-item-type-variation-folder-${sceneItemTypes[i].id}`
        for (let j = 0; j < sceneItemTypes[i].sceneItemTypeVariations; j++) {
            
            let li = document.createElement('li')
            li.setAttribute('onClick', 'selectSceneItemType('+sceneItemTypes[i].id+', '+j+')')
            
            let img = document.createElement('img')
            img.src = 'assets/'+sceneItemTypes[i].name+'/'+j+'.png'
            
            li.appendChild(img)
            variationsFolder.appendChild(li)
        }
        sceneItemMenu.appendChild(variationsFolder)
    }
}

function createWorldMap(width, height) {
    for (let i = 0; i < width; i++) {
        worldMap[i] = [];
        for (let j = 0; j < height; j++) {
            let waterTileType = getTileTypeByName('water')
            let gridSquare = {
                tile: {
                    tileType: waterTileType,
                    tileTypeVariation: 0
                },
                sceneItems: []
            };
            worldMap[i][j] = gridSquare;
        }
    }
}

async function preload() {
    for (let i = 0; i < tileTypes.length; i++) {
        for (let j = 0; j < tileTypes[i].tileTypeVariations; j++) {
            let imageSrc = `assets/${tileTypes[i].name}/${j}.png`
            let image = await loadImage(imageSrc)
            tileTypes[i].sprites[j] = image
            console.log(`Image loaded: ${imageSrc}`);
        }
    }
    for (let i = 0; i < sceneItemTypes.length; i++) {
        for (let j = 0; j < sceneItemTypes[i].sceneItemTypeVariations; j++) {
            let imageSrc = `assets/${sceneItemTypes[i].name}/${j}.png`
            let image = await loadImage(imageSrc)
            sceneItemTypes[i].sprites[j] = image
            console.log(`Image loaded: ${imageSrc}`);
        }
    }
}

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        let image = new Image()
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src
    });
}

function draw(worldMap, canvas) {
    var ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let i = 0
    let j = 0
    while (j < worldMap.length) {
        let gridSquare = worldMap[i][j]
        let sprites = gridSquare.tile.tileType.sprites
        let tileTypeVariation = gridSquare.tile.tileTypeVariation
        let image = sprites[tileTypeVariation]
        ctx.drawImage(image, i*gridSquareWidthPx+canvasOffsetX, j*gridSquareHeightPx+canvasOffsetY)

        ctx.strokeStyle  = "rgba(0, 0, 0, 0.1)";
        ctx.beginPath()
        ctx.rect(i*gridSquareWidthPx+canvasOffsetX, j*gridSquareHeightPx+canvasOffsetY, gridSquareWidthPx, gridSquareHeightPx)
        ctx.stroke()

        i++
        if (i !== 0 && i%worldMap.length == 0) {
            j++
            i = 0
        }
    }
    j = 0;
    while (j < worldMap.length) {
        let gridSquare = worldMap[i][j]
        for (let k = 0; k < gridSquare.sceneItems.length; k++) {
            let sprites = gridSquare.sceneItems[k].sceneItemType.sprites
            let sceneItemVariation = gridSquare.sceneItems[k].sceneItemTypeVariation
            let image = sprites[sceneItemVariation]
            ctx.drawImage(image, i*gridSquareWidthPx+canvasOffsetX, j*gridSquareHeightPx+canvasOffsetY)
        }
        i++
        if (i !== 0 && i%worldMap.length == 0) {
            j++
            i = 0
        }
    }
}

function selectTileType(id, variation) {
    if (variation == 0) {
        for (let i = 0; i < tileTypes.length; i++) {
            let variationsFolder = document.getElementById(`tile-type-variation-folder-${tileTypes[i].id}`)
                if (variationsFolder != null) {
                if (tileTypes[i].id != id) {
                    variationsFolder.classList.remove('open-folder')
                }
                else if(tileTypes[i].tileTypeVariations > 1) {
                    variationsFolder.classList.add('open-folder')
                }
            }
        }
    }
    selectedTileType = id
    selectedTileTypeVariation = variation

    selectedSceneItemType = null
}

function selectSceneItemType(id, variation) {
    if (variation == 0) {
        for (let i = 0; i < sceneItemTypes.length; i++) {
            let variationsFolder = document.getElementById(`scene-item-type-variation-folder-${sceneItemTypes[i].id}`)
            if (variationsFolder != null) {
                if (sceneItemTypes[i].id != id) {
                    variationsFolder.classList.remove('open-folder')
                }
                else if (sceneItemTypes[i].sceneItemTypeVariations > 1) {
                    variationsFolder.classList.add('open-folder')
                }
            }
        }
    }
    selectedSceneItemType = id
    selectedSceneItemTypeVariation = variation

    selectedTileType = null
}

function worldMapTilesToJson() {
    var worldMapTilesJson = []
    for (let i = 0; i < worldMap.length; i++) {
        for (let j = 0; j < worldMap.length; j++) {
            let gridSquare = worldMap[i][j]
            var tileTypeId = gridSquare.tile.tileType.id
            var tileTypeVariation = gridSquare.tile.tileTypeVariation

            let tile = {
                z: 0,
                x: i,
                y: j,
                tileId: tileTypeId,
                variation: tileTypeVariation
            }
            worldMapTilesJson.push(tile)
        }
    }

    return worldMapTilesJson
}

function worldMapSceneItemsToJson() {
    var worldMapSceneItemsJson = []
    for (let i = 0; i < worldMap.length; i++) {
        for (let j = 0; j < worldMap.length; j++) {
            let gridSquare = worldMap[i][j]
            for (let gridSquareSceneItem of gridSquare.sceneItems) {
                var sceneItemTypeId = gridSquareSceneItem.sceneItemType.id
                var sceneItemTypeVariation = gridSquareSceneItem.sceneItemTypeVariation
    
                let sceneItem = {
                    z: 0,
                    x: i,
                    y: j,
                    sceneItemTypeId: sceneItemTypeId,
                    sceneItemTypeVariation: sceneItemTypeVariation
                }
                console.log(sceneItem)
                worldMapSceneItemsJson.push(sceneItem)
            }
        }
    }

    return worldMapSceneItemsJson
}

function downloadJson(json, fileName, downloadAnchor) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    downloadAnchor.setAttribute("href",     dataStr     );
    downloadAnchor.setAttribute("download", fileName);
    downloadAnchor.click();
}

function exportMap() {
    let worldMapTilesJson = worldMapTilesToJson()
    let tilesAnchor = document.getElementById('downloadWorldMapTilesAnchor')
    downloadJson(worldMapTilesJson, "tiles.json", tilesAnchor)

    worldMapSceneItemsJson = worldMapSceneItemsToJson()
    let sceneItemsAnchor = document.getElementById('downloadWorldMapSceneItemsAnchor')
    downloadJson(worldMapSceneItemsJson, "sceneItems.json", sceneItemsAnchor)
}

function getClickedGridSquare(clickX, clickY) {
    let gridSquareX = parseInt((clickX-canvasOffsetX)/gridSquareWidthPx)
    let gridSquareY = parseInt((clickY-canvasOffsetY)/gridSquareHeightPx)

    return worldMap[gridSquareX][gridSquareY]
}

function changeGridSquareTileType(gridSquare) {
    let tileType = getTileTypeById(selectedTileType)
    gridSquare.tile.tileType = tileType
    gridSquare.tile.tileTypeVariation = selectedTileTypeVariation
}

function addSceneItemToGridSquare(gridSquare) {
    let sceneItemType = getSceneItemTypeById(selectedSceneItemType)
    let sceneItem = {
        sceneItemType: sceneItemType,
        sceneItemTypeVariation: selectedSceneItemTypeVariation
    }
    gridSquare.sceneItems.push(sceneItem)
    console.log(gridSquare.sceneItems)
}

function onMouseMove(event) {
    event.preventDefault()
    let rect = canvas.getBoundingClientRect();
    let mousePosX = event.clientX-rect.left
    let mousePosY = event.clientY-rect.top
    var distanceMovedX = mousePosX-mouseCurrentPositionX
    var distanceMovedY = mousePosY-mouseCurrentPositionY
    mouseCurrentPositionX = mousePosX
    mouseCurrentPositionY = mousePosY
    if (mousePressed) {
        if (spaceBarPressed) {
            canvasOffsetX += distanceMovedX
            canvasOffsetY += distanceMovedY
        }
        else {
            clickedGridSquare = getClickedGridSquare(mousePosX, mousePosY)

            if (selectedTileType != null) changeGridSquareTileType(clickedGridSquare)
        }
        draw(worldMap, canvas)
    }
}

function onMouseDown(event) {
    event.preventDefault()
    mousePressed = true;
    let rect = canvas.getBoundingClientRect();
    let clickX = event.clientX-rect.left
    let clickY = event.clientY-rect.top
    if (!spaceBarPressed) {
        clickedGridSquare = getClickedGridSquare(clickX, clickY)

        if (selectedTileType != null) changeGridSquareTileType(clickedGridSquare)
        if (selectedSceneItemType != null) addSceneItemToGridSquare(clickedGridSquare)

        draw(worldMap, canvas)
    }
}

function onMouseUp(event) {
    event.preventDefault()
    mousePressed = false;
}

function onKeyDown(event) {
    if (event.keyCode == 32) {
        event.preventDefault()
        spaceBarPressed = true
        document.body.style.cursor = "grab"
    }
}

function onKeyUp(event) {
    event.preventDefault()
    if (event.keyCode == 32) {
        spaceBarPressed = false
        document.body.style.cursor = "default"
    }
}

function registerEvents(canvas) {
    canvas.oncontextmenu = function (e) { e.preventDefault() }
    document.body.onkeydown = function (e) { onKeyDown(e) }
    document.body.onkeyup = function(e) { onKeyUp(e) }
}

window.onload =  async function() {
    canvas = document.getElementById('world-map')
    registerEvents(canvas)
    await preload()
    selectTileType(1, 0)
    populateTileMenu()
    populateSceneItemMenu()
    createWorldMap(50, 50)
    draw(worldMap, canvas)
}
