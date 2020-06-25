export class SpriteManager {
    private _spritesFolderPath: string
    private _config: any;
    private _spritesResolution: number;

    private _sprites: Array<Sprite>;
    private _spriteSheets: Array<SpriteSheet>
    
    constructor(spritesFolderPath: string) {
        this._spritesFolderPath = spritesFolderPath;
        this._config = require('./config/sprites.js');
        this._spritesResolution = 2;
        this._sprites = new Array<Sprite>();
        this._spriteSheets = new Array<SpriteSheet>()
    }

    /* #region Getters and Setters */
    get spritesResolution(): number {
        return this._spritesResolution;
    }
    /* #endregion */

    private async loadImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let image = new Image()
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src
        });
    }

    private async loadSpriteSheet(id: string, fileName: string): Promise<SpriteSheet> {
        let image = await this.loadImage(this._spritesFolderPath + fileName);
        let spriteSheet = new SpriteSheet(id, image);
        return spriteSheet;
    }

    public async preload() {
        console.log('Sprites preloading started.');
        for (let spriteSheetConfig of this._config.spriteSheets) {
            let spriteSheet = await this.loadSpriteSheet(spriteSheetConfig.id, spriteSheetConfig.file);
            this._spriteSheets.push(spriteSheet);
            for (let spriteConfig of spriteSheetConfig.sprites) {
                let sprite = new Sprite(
                    spriteConfig.variation,
                    spriteSheet,
                    spriteConfig.x*this._spritesResolution,
                    spriteConfig.y*this._spritesResolution,
                    spriteConfig.width*this._spritesResolution,
                    spriteConfig.height*this._spritesResolution,
                    spriteConfig.offsetX*this._spritesResolution,
                    spriteConfig.offsetY*this._spritesResolution,
                    spriteConfig.zIndex
                );
                this._sprites.push(sprite)
            }
            console.log('Sprite loaded: '+spriteSheet.id)
        }
        console.log('Sprites preloading ended.')
    }

    public getSprite(spriteSheetId: string, variation: number): Sprite {
        let existingSprite: Sprite
        for (let sprite of this._sprites) {
            if (sprite.sheet.id == spriteSheetId && sprite.variation == variation) {
                existingSprite = sprite
                break
            }
        }
        return existingSprite
    }

    public getSpriteVariations(spriteSheetId: string): number {
        let variations = 0
        for (let sprite of this._sprites) {
            if (sprite.sheet.id == spriteSheetId) {
                variations++
            }
        }
        return variations
    }
}

export class Sprite {
    private _variation: number
    private _sheet: SpriteSheet
    private _x: number
    private _y: number
    private _width: number
    private _height: number
    private _offsetX: number
    private _offsetY: number
    private _zIndex: number

    constructor(variation: number, spriteSheet: SpriteSheet, x: number, y: number,
                width: number, height: number, offsetX: number, offsetY: number,
                zIndex: number)
    {
        this._variation = variation
        this._sheet = spriteSheet
        this._x = x
        this._y = y
        this._width = width
        this._height = height
        this._offsetX = offsetX
        this._offsetY = offsetY
        this._zIndex = zIndex
    }

    /* #region Getters and Setters */
    get x(): number {
        return this._x
    }
    
    get y(): number {
        return this._y
    }

    get width(): number {
        return this._width
    }

    get height(): number {
        return this._height
    }

    get offsetX(): number {
        return this._offsetX
    }

    get offsetY(): number {
        return this._offsetY
    }

    get variation(): number {
        return this._variation
    }

    get sheet(): SpriteSheet {
        return this._sheet
    }
    /* #endregion */
}

export class SpriteSheet {
    private _id: string
    private _image: HTMLImageElement

    constructor(id: string, image: HTMLImageElement) {
        this._id = id
        this._image = image
    }

    /* #region Getters and Setters */
    get id(): string {
        return this._id;
    }

    get image(): HTMLImageElement {
        return this._image;
    }
    /* #endregion */
}