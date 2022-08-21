import { Game } from "../Game";
import { Entity } from "./Entity";


export class PhysicsObject extends Entity {
    public velocityX: number;
    public velocityY: number;
    public jumpHeight: number;

    public gravity: number;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.velocityX = 0;
        this.velocityY = 0;
        this.jumpHeight = 0;

        this.gravity = 10;
    }

    public async beforeTick(gameState: Game): Promise<void> {
        await this.applyGravity(gameState);
    }

    public async tickBehaviour(gameState: Game) {
    }

    private async applyGravity(gameState: Game) {            
        if (this.isJumping()) {
            this.jumpHeight += (this.velocityY*-1);

            if (this.jumpHeight >= this.height * 6) {
                this.velocityY = gameState.player.gravity;
                this.jumpHeight = 0;
            }
        } else {
            if (this.standingOnAPlatform(gameState)) {
                this.velocityY = 0;
            } else {
                this.velocityY = gameState.player.gravity;
            }
        }
    }

    public collidesWith(other: PhysicsObject) {
        if (other.x >= this.x && other.x <= this.x + this.width &&
            other.y >= this.y && other.y <= this.y + this.height) {
            return true;
        }
        return false;
    }

    public standingOnAPlatform(gameState: Game) {
        return gameState.playfield.isSolidSurface(this.leadingEdge(), this.bottom() + 1)
            || gameState.playfield.isSolidSurface(this.trailingEdge(), this.bottom() + 1);
    }

    public bottom() { return this.y + this.height; }
    public leadingEdge() { return this.velocityX < 0 ? this.x : this.x + this.width; }
    public trailingEdge() { return this.velocityX < 0 ? this.x + this.width : this.x; }
    public isMoving() { return this.velocityX != 0; }
    public isJumping() { return this.velocityY < 0; }
    public isFalling() { return this.velocityY > 0; }
}
