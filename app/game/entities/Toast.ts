import { Game } from "../Game";
import { ITickable } from "../behaviours/ITickable";
import { PhysicsObject } from "./PhysicsObject";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";
import { loadImage } from "../animation/LoadImage";

export class Toast extends PhysicsObject implements ITickable, IDrawable, IInitialisable {

    private texture: HTMLImageElement;
    private coolOffTickCounter = 0;

    constructor(x: number, y: number, width: number = -1, height: number = -1) {
        super(x, y, width, height);
    }

    public async init(): Promise<void> {
        this.texture = await loadImage("/toast.1.png");

        if (this.width === -1) {
            this.width = this.texture.width;
        }

        if(this.height === -1) {
            this.height = this.texture.height;
        }
    }

    public async onTick(gameState: Game) {   
        super.onTick(gameState);

        if (this.coolOffTickCounter > 0) {
            this.coolOffTickCounter--;
        }

        const distanceFromPlayer = Math.abs(gameState.player.x - this.x);
        
        if (distanceFromPlayer < 100 && this.velocityY == 0 && this.coolOffTickCounter === 0) {
            this.velocityY = 20;
            this.coolOffTickCounter = 99;
        }
    }
    

    public draw(gameState: Game) {
        this.drawImage(gameState, this.texture);
    }
}