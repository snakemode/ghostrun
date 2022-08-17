import { Game } from "../Game";
import { Sprite } from "./Sprite";
import { Character } from "./Character";

export class Enemy extends Character {
    constructor(x: number, y: number) {
        super(x, y, 25, 25, new Sprite("graphics/slime", 4), new Sprite("graphics/slime", 4));
    }

    public tick(gameState: Game) {
        if (!this.isAlive) {
            return;
        }

        this.speed = 2;

        if (gameState.player.x < this.x) {
            this.speed *= -1;
        }

        if (this.collidesWith(gameState.player)) {
            gameState.player.die();
        }

        super.tick(gameState);
    }
}
