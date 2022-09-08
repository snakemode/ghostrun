import SuperGif from "../animation/libgif";
import { loadImage } from "../animation/LoadImage";
import { IDrawable } from "../behaviours/IDrawable";
import { Game } from "../Game";
import { EntityBase } from "./EntityBase";

export class GifAsset extends EntityBase implements IDrawable {

    public filename: string;
    private _image: HTMLImageElement;
    private _gif: HTMLCanvasElement;

    constructor(x: number, y: number, filename: string) {
        super(x, y, 25, 20);
        this.filename = filename;    
    }

    public async beforeTick(gameState: Game): Promise<void> { 
        if (!this._gif) {    
            this._image = await loadImage("/" + this.filename);            
            var rub = SuperGif({ gif: this._image } );
            rub.load();
            await sleep(250);
            this._gif = rub.get_canvas();
        }
    }

    public async tickBehaviour(gameState: Game) {
    }
    
    public draw(gameState: Game): void {
        if (!this._gif) {
            return;
        }

        const distanceOffset = gameState.playfield.distanceTravelled > 0 
                                ? gameState.playfield.distanceTravelled
                                : 0;
                                
        const drawAtX = (this.x - distanceOffset);
        const canvasY = gameState.playfield.height - this.y - this._image.height;

        gameState.playfield.ctx.drawImage(this._gif, drawAtX, canvasY);
    }
}

const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};