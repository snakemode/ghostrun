import { Game } from "../Game";
import { ITickable } from "../roles/ITickable";
import { Movable } from "../behaviours/Movable";
import { Killable } from "../behaviours/Killable";
import { PhysicsObject } from "./PhysicsObject";

export class Character extends PhysicsObject implements ITickable {

    runningSprite: any;
    runningSpriteReversed: any;

    constructor(x: number, y: number, width: number, height: number, runningSprite: any, reverseSprite: any) {
        super(x, y, width, height);

        this.addBehaviour(Movable.name, new Movable(this));
        this.addBehaviour(Killable.name, new Killable(this));

        this.runningSprite = runningSprite;
        this.runningSpriteReversed = reverseSprite;
    }


    public draw(gameState: Game) {
        if (!this.isAlive || !this.runningSprite) { 
            return; 
        }

        var screenX = this.x - gameState.playfield.distanceTravelled;
        screenX = screenX > this.x ? this.x : screenX;

        if (gameState.playfield.atLevelEnd()) {
            screenX = (gameState.playfield.width - (gameState.playfield.width - gameState.playfield.distanceTravelled - (this.x - gameState.playfield.distanceTravelled)));
        }

        var sprite = this.velocityX < 0 ? this.runningSpriteReversed : this.runningSprite;

        if (this.isJumping() || this.isFalling()) {
            sprite.drawFrame(4, screenX, this.y, this.height, this.width, gameState.ctx);
        } else if (this.isMoving()) {
            sprite.draw(gameState.playfield.tickCount, screenX, this.y, this.height, this.width, gameState.ctx);
        } else {
            sprite.drawFrame(1, screenX, this.y, this.height, this.width, gameState.ctx);
        }
    }

    public get isAlive() {        
        return this.behaviour<Killable>(Killable.name).isAlive;
    }
}
