import { Game } from "../Game";
import { Entity } from "../entities/Entity";
import { IBehaviour } from "./IBehaviour";
import { PhysicsObject } from "../entities/PhysicsObject";

export class Killable implements IBehaviour {
    public isAlive: boolean;
    private entity: PhysicsObject;

    constructor(parent: Entity) {
        this.entity = parent as PhysicsObject;
        this.isAlive = true;
    }

    public async act(gameState: Game) {
        if (!this.isAlive) {
            return false;
        }

        if (gameState.playfield.isPit(this.entity.leadingEdge(), this.entity.bottom())) {
            this.kill();
            return false; // short circuit the rest of the behaviours
        }
    }

    public kill() {
        this.isAlive = false;
        this.entity.velocityX = 0;
        this.entity.velocityY = 0;
    }
}
