import { Game } from "../Game";
import { ITickable } from "../behaviours/ITickable";
import { Killable } from "../behaviours/Killable";
import { PhysicsObject } from "./PhysicsObject";
import { Sprite, ValidFrameId } from "../animation/Sprite";
import { IDrawable } from "../behaviours/IDrawable";
import { IInitialisable } from "../behaviours/IInitilisable";

export class Character extends PhysicsObject implements ITickable, IDrawable, IInitialisable {

    private runningSprite: Sprite;
    private get currentSprite() { return this.runningSprite; }

    constructor(x: number, y: number, width: number, height: number, runningSprite: Sprite) {
        super(x, y, width, height);
        this.addBehaviour(Killable.name, new Killable(this));
        this.runningSprite = runningSprite;
    }

    public async init() {
        await this.runningSprite.init();
    }

    public async onTick(gameState: Game) {
        super.onTick(gameState);        
        this.currentSprite.tick(gameState);
        this.runningSprite.setDirection(this.facing);
    }

    public draw({ playfield, debug }: Game) {
        if (!this.isAlive || !this.runningSprite) { 
            return; 
        }

        let frameId: ValidFrameId;
        if (this.isJumping || this.isFalling) {      
            frameId = 3;
        } else if (this.isMoving) {
            frameId = "auto";
        } else {
            frameId = "stopped";
        }

        this.currentSprite.draw(playfield, this, frameId, debug);
    }

    public get isAlive() {
        return this.behaviour<Killable>(Killable.name)?.isAlive;
    }
}
