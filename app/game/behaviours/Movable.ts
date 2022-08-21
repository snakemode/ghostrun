import { Game } from "../Game";
import { Entity } from "../entities/Entity";
import { IBehaviour } from "./IBehaviour";
import { PhysicsObject } from "../entities/PhysicsObject";

export class Movable implements IBehaviour {
    private entity: PhysicsObject;

    constructor(parent: Entity) {
        this.entity = parent as PhysicsObject;
    }

    public async act(gameState: Game) {
        var nextX = this.entity.x + this.entity.velocityX;
        var nextY = this.entity.y + this.entity.velocityY;
        var nextLeadingX = this.entity.leadingEdge() + this.entity.velocityX;

        var walkingIntoSurface = gameState.playfield.isSolidSurface(nextLeadingX, this.entity.y);

        if (this.entity.isMoving() && walkingIntoSurface) {
            nextX = this.entity.x;
            this.entity.velocityX = 0;
        }

        var topLeftIsSolid = gameState.playfield.isSolidSurface(this.entity.leadingEdge(), this.entity.y);
        var topRightIsSolid = gameState.playfield.isSolidSurface(this.entity.trailingEdge(), this.entity.y);

        if ((topLeftIsSolid || topRightIsSolid) && this.entity.isJumping()) {
            this.entity.velocityY = gameState.player.gravity;
        }

        this.entity.x = nextX;
        this.entity.y = nextY;
    }
}

