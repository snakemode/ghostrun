import SuperGif from "../animation/libgif";
import { loadImage } from "../animation/LoadImage";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";
import { Game } from "../Game";
import { EntityBase } from "./EntityBase";

export class GifAsset extends EntityBase implements IDrawable, IInitialisable {

    public filename: string;
    private _gif: HTMLCanvasElement;

    private static GifCache = new Map<string, HTMLCanvasElement>();

    constructor(x: number, y: number, filename: string) {
        super(x, y, 25, 20);
        this.filename = filename;    
    }

    public async init() {         
        if (GifAsset.GifCache.has(this.filename)) {
            this._gif = GifAsset.GifCache.get(this.filename);
            return;
        }

        const image = await loadImage("/" + this.filename);  
        var gif = SuperGif({ gif: image } );        
        await new Promise((res, rej) => {
            gif.load(() => {
                res(gif);
            });
        });

        this._gif = gif.get_canvas();

        GifAsset.GifCache.set(this.filename, this._gif);        
    }

    public async beforeTick(gameState: Game): Promise<void> { 
    }

    public async onTick(gameState: Game) {
    }
    
    public draw(gameState: Game): void {
        this.drawImage(gameState, this._gif);
    }
}
