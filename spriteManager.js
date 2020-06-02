class SpriteManager {
    constructor() {
        this.spriteSheets = []
    }

    async loadImage(src) {
        return new Promise((resolve, reject) => {
            let image = new Image()
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src
        });
    }

    async preload() {
        for (let i = 0; i < spritesConfig.spriteSheets.length; i++) {
            let spriteSheetJson = spritesConfig.spriteSheets[i]
            let spriteSheetImageSrc = `assets/${spriteSheetJson.file}`
            let spriteSheetImage = await this.loadImage(spriteSheetImageSrc)
            let spriteSheet = new SpriteSheet(spriteSheetJson.id, spriteSheetImage)
            this.spriteSheets.push(spriteSheet)

            for (let j = 0; j < spriteSheetJson.sprites.length; j++) {
                let spriteJson = spriteSheetJson.sprites[j]
                let sprite = new Sprite(
                    spriteJson.variation, spriteSheet, spriteJson.x, spriteJson.y,
                    spriteJson.width, spriteJson.height, spriteJson.offsetX,
                    spriteJson.offsetY, spriteJson.zIndex
                )
                spriteSheet.sprites.push(sprite)
            }
            console.log('Sprites loaded: '+spriteSheet.id);
        }
    }

    getSpriteSheet(id) {
        let existingSpriteSheet;
        for (let spriteSheet of this.spriteSheets) {
            if (spriteSheet.id == id) {
                existingSpriteSheet = spriteSheet;
                break;
            }
        }
        return existingSpriteSheet;
    }

    getSprite(id, variation) {
        let existingSprite;
        outerLoop:
        for (let spriteSheets of this.spriteSheets) {
            if (spriteSheets.id == id) {
                for (let sprite of spriteSheets.sprites) {
                    if (sprite.variation == variation) {
                        existingSprite = sprite;
                        break outerLoop;
                    }
                }
            }
        }
        return existingSprite;
    }
}

class SpriteSheet {
    constructor(id, image) {
        this.id = id
        this.image = image
        this.sprites = []
    }
}

class Sprite {
    constructor(variation, spriteSheet, x, y, width, height, offsetX, offsetY, zIndex) {
        this.variation = variation
        this.spriteSheet = spriteSheet
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.offsetX = offsetX
        this.offsetY = offsetY
        this.zIndex = zIndex
    }
}