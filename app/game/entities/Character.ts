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

    public async tick(gameState: Game) {
        if (!this.isAlive) {
            return;
        }

        if (gameState.playfield.isPit(this.leadingEdge(), this.bottom())) {
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
                this.downwardForce = gameState.playfield.gravity;
                this.jumpHeight = 0;
            }
        } else {
            if (this.standingOnAPlatform(gameState)) {
                this.downwardForce = 0;
            } else {
                this.downwardForce = gameState.playfield.gravity;
            }
        }
    }

    applyMovement(gameState: Game) {
        var nextX = this.x + this.speed;
        var nextY = this.y + this.downwardForce;
        var nextLeadingX = this.leadingEdge() + this.speed;

        var walkingIntoSurface = gameState.playfield.isSolidSurface(nextLeadingX, this.y);
        if (this.isMoving() && walkingIntoSurface) {
            nextX = this.x;
            this.speed = 0;
        }

        var topLeftIsSolid = gameState.playfield.isSolidSurface(this.leadingEdge(), this.y);
        var topRightIsSolid = gameState.playfield.isSolidSurface(this.trailingEdge(), this.y);

        if ((topLeftIsSolid || topRightIsSolid) && this.isJumping()) {
            this.downwardForce = gameState.playfield.gravity;
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
        return gameState.playfield.isSolidSurface(this.leadingEdge(), this.bottom() + 1)
            || gameState.playfield.isSolidSurface(this.trailingEdge(), this.bottom() + 1);
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

        var screenX = this.x - gameState.playfield.distanceTravelled;
        screenX = screenX > this.x ? this.x : screenX;

        if (gameState.playfield.atLevelEnd()) {
            screenX = (gameState.playfield.width - (gameState.playfield.width - gameState.playfield.distanceTravelled - (this.x - gameState.playfield.distanceTravelled)));
        }

        var sprite = this.speed < 0 ? this.runningSpriteReversed : this.runningSprite;

        if (this.isJumping() || this.isFalling()) {
            sprite.drawFrame(4, screenX, this.y, this.height, this.width, gameState.ctx);
        } else if (this.isMoving()) {
            sprite.draw(gameState.playfield.tickCount, screenX, this.y, this.height, this.width, gameState.ctx);
        } else {
            sprite.drawFrame(1, screenX, this.y, this.height, this.width, gameState.ctx);
        }
    }
}
