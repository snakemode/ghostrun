import { Game } from "../Game";
import { EntityBase } from "./EntityBase";

export class PhysicsObject extends EntityBase {
    public velocityX: number;
    public velocityY: number;

    public gravityDistancePerTick: number;
    public weight: number;

    public entityCollisionOffsets = [];
    public environmentCollisionOffsets = [];
    
    constructor(x: number, y: number, width: number, height: number, velX: number = 0, velY: number = 0) {
        super(x, y, width, height);

        this.velocityX = velX;
        this.velocityY = velY;
        this.weight = 12;

        this.gravityDistancePerTick = -8.5;

        if (this.velocityX !== 0) {
            this.facing = this.velocityX > 0 ? "RIGHT" : "LEFT"; 
        }

        this.environmentCollisionOffsets = [
            { x: 0, y: 0 },
            { x: this.width / 2, y: 0 },
            { x: this.width, y: 0 },
        ];

        this.entityCollisionOffsets = [{ 
            x: this.width / 2,
            y: this.height / 2        
        }];
    }

    public async beforeTick(gameState: Game): Promise<void> {
    }

    public async onTick(gameState: Game) {
        this.applyGravity(gameState);
        this.applyMovement(gameState);
    }

    public async applyMovement(gameState: Game) {
        var nextX = this.x + this.velocityX;
        var nextY = this.y + this.velocityY;
        const collisionBounds = this.collisionBoundsFor(nextX, nextY);
        
        var walkingIntoSurface = gameState.playfield.isSolidSurface(collisionBounds.leadingX, this.top);

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

        if (this.velocityX !== 0) {
            this.facing = this.velocityX > 0 ? "RIGHT" : "LEFT"; 
        }
    }

    private ensureFloorBoundaries(gameState: Game, nextX: number, nextY: number) {
        let collides = this.collidesFrom(nextX, nextY, gameState);

        let bumps = 0;
        let maxBumps = Math.abs(this.velocityY) * 2;
        
        while (collides) {
            nextY -= 1 * this.verticalDirection;
            this.velocityY = 0;

            collides = this.collidesFrom(nextX, nextY, gameState);
                
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
                this.velocityY += this.gravityDistancePerTick / 6;
            }
        }
    }

    public collidesWith(other: PhysicsObject, aggressive: boolean = false) {
        if (this.center.x >= other.x && this.center.x <= other.x + other.width) {
            if (this.center.y <= other.top && this.center.y >= other.bottom) {
                return true;
            }
        }

        if (aggressive) {
            // check if boxes collide 
            if (this.x < other.x + other.width &&
                this.x + this.width > other.x &&
                this.y < other.y + other.height &&
                this.height + this.y > other.y) {
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

    public draw(gameState: Game): void {
        throw new Error("Method not implemented - should be implemented by derived class.");
    }

    public get isMoving() { return this.velocityX != 0; }
    public get isJumping() { return this.velocityY > 0; }
    public get isFalling() { return this.velocityY < 0; }
    public get verticalDirection () { return this.isJumping ? 1 : -1 }
    public get horizontalDirection () { return this.velocityX > 0 ? 1 : -1 }
    public get isJumpingOrFalling() { return this.velocityY !== 0; }
    public get jumpingOrFalling() { return this.isJumping ? "JUMPING" : "FALLING"; }
    
    public get leadingEdge() {
        if (this.facing == "LEFT") {
            return this.x;
        }

        return this.x + this.width;
    }

    public get trailingEdge() {
        if (this.facing == "RIGHT") {
            return this.x;
        }

        return this.x + this.width;
    }

    public get center() {
        return {
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        }
    }

    public get collisionCenter() {
        return this.collisionBoundsFor().center;
    }

    public collisionBoundsFor(xPosition = this.x, yPosition = this.y) {
        let leadingX: number;
        let trailingX: number;
        let left: number;
        let right: number;
        
        let center: {x: number, y: number} =  {
            x: xPosition + this.width - (this.width / 2), 
            y: yPosition + (this.height / 2)
        }

        if (this.facing == "RIGHT") {
            left = xPosition + this.width  - this.width;
            right = xPosition + this.width;
            leadingX = right;
            trailingX = left;
            center = {
                x: xPosition + this.width - (this.width / 2), 
                y: yPosition + (this.height / 2)
            };
        } else {
            left = xPosition;
            right = xPosition + this.width;            
            leadingX = left;
            trailingX = right;
            center = this.coordinatesAdjustedForFacing(center.x, center.y);
        }

        return {
            left: left,
            right: right,
            top: yPosition + this.height,
            bottom: yPosition,

            leadingX: leadingX,
            trailingX: trailingX,
            center: center,
            facing: this.facing,
        }
    }

    private coordinatesAdjustedForFacing(x: number, y: number) {
        if (this.facing == "LEFT") {
            x = x - this.width;
        }

        return {x: x, y: y};
    }
    
    private collidesFrom(x: number, y: number, gameState: Game) {
        const points = this.environmentCollisionPoints(x, y);
        return points.some(point => (gameState.playfield.isSolidSurface(point.x, point.y)));
    }

    public environmentCollisionPoints(x = this.x, y = this.y) {
        return this.environmentCollisionOffsets.map(offset => ({
            x: this.facing == "RIGHT" ? x + offset.x : x + this.width - offset.x,
            y: y + offset.y
        }));
    }

}
