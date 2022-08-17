import { Game } from "../Game";
import { ITickable } from "../roles/ITickable";

export class Character implements ITickable {
    x: number;
    y: number;
    height: number;
    width: number;
    speed: number;
    downwardForce: number;
    jumpHeight: number;
    runningSprite: any;
    runningSpriteReversed: any;
    isAlive: boolean;
    dowwardForce: number;

    constructor(x: number, y: number, width: number, height: number, runningSprite: any, reverseSprite: any) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.speed = 0;
        this.downwardForce = 0;
        this.jumpHeight = 0;
        this.runningSprite = runningSprite;
        this.runningSpriteReversed = reverseSprite;
        this.isAlive = true;
    }

    public tick(gameState: Game) {
        if (!this.isAlive) {
            return;
        }

        if (gameState.world.isPit(this.leadingEdge(), this.bottom())) {
            this.die();
        }

        this.applyGravity(gameState);
        this.applyMovement(gameState);
    }

    public die() {
        this.isAlive = false;
        this.speed = 0;
        this.dowwardForce = 0;
    }

    applyGravity(gameState: Game) {
        if (this.isJumping()) {
            this.jumpHeight += (this.downwardForce * -1);

            if (this.jumpHeight >= this.height * 6) {
                this.downwardForce = gameState.world.gravity;
                this.jumpHeight = 0;
            }
        } else {
            if (this.standingOnAPlatform(gameState)) {
                this.downwardForce = 0;
            } else {
                this.downwardForce = gameState.world.gravity;
            }
        }
    }

    applyMovement(gameState: Game) {
        var nextX = this.x + this.speed;
        var nextY = this.y + this.downwardForce;
        var nextLeadingX = this.leadingEdge() + this.speed;

        var walkingIntoSurface = gameState.world.isSolidSurface(nextLeadingX, this.y);
        if (this.isMoving() && walkingIntoSurface) {
            nextX = this.x;
            this.speed = 0;
        }

        var topLeftIsSolid = gameState.world.isSolidSurface(this.leadingEdge(), this.y);
        var topRightIsSolid = gameState.world.isSolidSurface(this.trailingEdge(), this.y);

        if ((topLeftIsSolid || topRightIsSolid) && this.isJumping()) {
            this.downwardForce = gameState.world.gravity;
            this.jumpHeight = 0;
        }

        this.x = nextX;
        this.y = nextY;
    }

    bottom() { return this.y + this.height; }
    isJumping() { return this.downwardForce < 0; }
    isFalling() { return this.downwardForce > 0; }
    isMoving() { return this.speed != 0; }
    leadingEdge() { return this.speed < 0 ? this.x : this.x + this.width; }
    trailingEdge() { return this.speed < 0 ? this.x + this.width : this.x; }
    standingOnAPlatform(gameState: Game) {
        return gameState.world.isSolidSurface(this.leadingEdge(), this.bottom() + 1)
            || gameState.world.isSolidSurface(this.trailingEdge(), this.bottom() + 1);
    }

    collidesWith(other) {
        if (other.x >= this.x && other.x <= this.x + this.width &&
            other.y >= this.y && other.y <= this.y + this.height) {
            return true;
        }
        return false;
    }

    draw(gameState: Game) {
        if (!this.isAlive || !this.runningSprite) { return; }

        var screenX = this.x - gameState.world.distanceTravelled;
        screenX = screenX > this.x ? this.x : screenX;

        if (gameState.world.atLevelEnd()) {
            screenX = (gameState.world.width - (gameState.world.width - gameState.world.distanceTravelled - (this.x - gameState.world.distanceTravelled)));
        }

        var sprite = this.speed < 0 ? this.runningSpriteReversed : this.runningSprite;

        if (this.isJumping() || this.isFalling()) {
            sprite.drawFrame(4, screenX, this.y, this.height, this.width, gameState.ctx);
        } else if (this.isMoving()) {
            sprite.draw(gameState.world.tickCount, screenX, this.y, this.height, this.width, gameState.ctx);
        } else {
            sprite.drawFrame(1, screenX, this.y, this.height, this.width, gameState.ctx);
        }
    }
}
