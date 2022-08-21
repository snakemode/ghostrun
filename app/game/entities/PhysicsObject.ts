import { Game } from "../Game";
import { Entity } from "./Entity";

export class PhysicsObject extends Entity {
    public velocityX: number;
    public velocityY: number;

    public gravityDistancePerTick: number;
    public weight: number;
    
    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);

        this.velocityX = 0;
        this.velocityY = 0;
        this.weight = 15;

        this.gravityDistancePerTick = 8.5;
    }

    public async beforeTick(gameState: Game): Promise<void> {
        await this.applyGravity(gameState);
    }

    public async tickBehaviour(gameState: Game) {
        this.applyMovement(gameState);
    }

    public async applyMovement(gameState: Game) {
        var nextX = this.x + this.velocityX;
        var nextY = this.y + this.velocityY;
        var nextLeadingX = this.leadingEdge + this.velocityX;

        var walkingIntoSurface = gameState.playfield.isSolidSurface(nextLeadingX, this.top);

        if (this.isMoving && walkingIntoSurface) {
            nextX = this.x;
            this.velocityX = 0;
        }

        if (this.collidingUpwards(gameState)) {
            this.velocityY = this.gravityDistancePerTick;
        }

        this.x = nextX;
        this.y = nextY;
    }

    private async applyGravity(gameState: Game) {            
        if (this.isJumping) {
            const resistencePerTick = this.weight / 60;
            this.velocityY += this.gravityDistancePerTick * resistencePerTick;
 
        } else {
            if (this.standingOnAPlatform(gameState)) {
                this.velocityY = 0;
            } else {
                this.velocityY = this.gravityDistancePerTick;
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

    public collidingUpwards(gameState: Game) {
        for (let x = this.x; x < this.x + this.width; x++) {
            if (gameState.playfield.isSolidSurface(x, this.top + 1)) {
                return true;
            }
        }
    }

    public standingOnAPlatform(gameState: Game) {
        for (let x = this.x; x < this.x + this.width; x++) {
            if (gameState.playfield.isSolidSurface(x, this.bottom + 1)) {
                return true;
            }
        }
    }

    public get top() { return this.y; }
    public get bottom() { return this.y + this.height; }
    public get leadingEdge() { return this.velocityX < 0 ? this.x : this.x + this.width; }
    public get trailingEdge() { return this.velocityX < 0 ? this.x + this.width : this.x; }
    public get isMoving() { return this.velocityX != 0; }
    public get isJumping() { return this.velocityY < 0; }
    public get isFalling() { return this.velocityY > 0; }
}
