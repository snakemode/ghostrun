import { Game } from "../Game";
import { Entity } from "./Entity";

export class PhysicsObject extends Entity {
    public velocityX: number;
    public velocityY: number;

    public gravityDistancePerTick: number;
    public weight: number;
    
    constructor(x: number, y: number, width: number, height: number, velX: number = 0, velY: number = 0) {
        super(x, y, width, height);

        this.velocityX = velX;
        this.velocityY = velY;
        this.weight = 15;

        this.gravityDistancePerTick = -8.5;
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
            if (gameState.playfield.isSolidSurface(x, this.bottom - 1)) {
                return true;
            }
        }
    }

    public leadingEdgeCollision(gameState: Game) {
        return gameState.playfield.isSolidSurface(this.leadingEdge, this.top) || gameState.playfield.isSolidSurface(this.leadingEdge, this.bottom);
    }

    public bottomEdgeCollision(gameState: Game) {
        return gameState.playfield.isSolidSurface(this.x, this.bottom) || gameState.playfield.isSolidSurface(this.x + this.width, this.bottom);
    }

    private fall(gameState: Game) {
        for (let i = 0; i < Math.abs(this.velocityY); i++) {
            this.y -= i;

            if (this.bottomEdgeCollision(gameState)) {
                this.y += i;
                this.velocityY = 0;
                break;
            }           
        }   
    }

    public get top() { return this.y + this.height; }
    public get bottom() { return this.y; }
    public get facing() { return this.velocityX < 0 ? "RIGHT" : "LEFT"; }
    public get leadingEdge() { return this.velocityX < 0 ? this.x : this.x + this.width; }
    public get trailingEdge() { return this.velocityX < 0 ? this.x + this.width : this.x; }
    public get isMoving() { return this.velocityX != 0; }
    public get isJumping() { return this.velocityY > 0; }
    public get isFalling() { return this.velocityY < 0; }
    public get isJumpingOrFalling() { return this.velocityY !== 0; }
    public get jumpingOrFalling() { return this.isJumping ? "JUMPING" : "FALLING"; }

}
