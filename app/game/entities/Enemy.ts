import { Game } from "../Game";
import { Sprite } from "../animation/Sprite";
import { Character } from "./Character";
import { Killable } from "../behaviours/Killable";

export class Enemy extends Character {
    constructor(x: number, y: number) {
        super(x, y, 68, 39, new Sprite("graphics/enemy", 4, 12));
 
        // Let's not have the mouse tail colliding
        this.environmentCollisionOffsets = [];
        for (let x = 34; x < this.width; x++) {
            this.environmentCollisionOffsets.push({ x: x, y: 0 });
        }

        this.entityCollisionOffsets.push({ x: 60, y: 20 });
        
        this.facing = "LEFT";
    }

    public async onTick(gameState: Game) {
        super.onTick(gameState);
        
        this.velocityX = 2;

        if (gameState.player.center.x < this.center.x) {
            this.velocityX *= -1;
        }

        if (this.collidesWith(gameState.player)) {
            gameState.player.hasBehaviour(Killable.name, (killable: Killable) => {
                killable.kill(this);
            });
        }
    }
}
