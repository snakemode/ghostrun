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
        this.weight = 12;

        this.gravityDistancePerTick = -8.5;
    }

    public async beforeTick(gameState: Game): Promise<void> {
    }

    public async tickBehaviour(gameState: Game) {
        this.applyGravity(gameState);
        this.applyMovement(gameState);
    }

    public async applyMovement(gameState: Game) {
        var nextX = this.x + this.velocityX;
        var nextY = this.y + this.velocityY;
        var nextLeadingEdge = this.facing == "LEFT" ? nextX : nextX + this.width;

        var walkingIntoSurface = gameState.playfield.isSolidSurface(nextLeadingEdge, this.top);

        if (this.isMoving && walkingIntoSurface) {
            nextX = this.x;
            this.velocityX = 0;
        }

        nextY = this.ensureFloorBoundaries(gameState, nextX, nextY);

        if (this.collidingUpwards(gameState)) {
            this.velocityY = this.gravityDistancePerTick;
        }

        this.x = Math.floor(nextX);
        this.y = Math.floor(nextY);
    }

    private ensureFloorBoundaries(gameState: Game, nextX: number, nextY: number) {       
        let collides = 
            gameState.playfield.isSolidSurface(nextX, nextY) 
            || gameState.playfield.isSolidSurface(nextX + (this.width / 2), nextY)
            || gameState.playfield.isSolidSurface(nextX + this.width, nextY);

        if (!collides) {
            return nextY;
        }

        let bumps = 0;
        let maxBumps = Math.abs(this.velocityY) * 2;
        
        while (collides) {
            nextY -= 1 * this.verticalDirection;
            this.velocityY = 0;

            collides = 
                gameState.playfield.isSolidSurface(nextX, nextY) 
                || gameState.playfield.isSolidSurface(nextX + (this.width / 2), nextY)
                || gameState.playfield.isSolidSurface(nextX + this.width, nextY);
                
            if (bumps >= maxBumps) {
                break;
            }
        }
        
        return nextY;
    }

    private applyGravity(gameState: Game) {            
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
        if (other.center.x >= this.x && other.center.x <= this.x + this.width) {
            if (other.center.y <= this.top && other.center.y >= this.bottom) {
                return true;
            }
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


    public get top() { return this.y + this.height; }
    public get bottom() { return this.y; }
    public get facing() { return this.velocityX > 0 ? "RIGHT" : "LEFT"; }
    public get leadingEdge() { return this.velocityX < 0 ? this.x : this.x + this.width; }
    public get trailingEdge() { return this.velocityX < 0 ? this.x + this.width : this.x; }
    public get isMoving() { return this.velocityX != 0; }
    public get isJumping() { return this.velocityY > 0; }
    public get isFalling() { return this.velocityY < 0; }
    public get verticalDirection () { return this.isJumping ? 1 : -1 }
    public get horizontalDirection () { return this.velocityX > 0 ? 1 : -1 }
    public get isJumpingOrFalling() { return this.velocityY !== 0; }
    public get jumpingOrFalling() { return this.isJumping ? "JUMPING" : "FALLING"; }

    public get center() {
        return {
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        }
    }


}
