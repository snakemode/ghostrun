import { Game } from "../Game";
import { Sprite } from "./Sprite";
import { Character } from "./Character";
import { Killable } from "../behaviours/Killable";

export class Enemy extends Character {
    constructor(x: number, y: number) {
        super(x, y, 25, 25, new Sprite("graphics/slime", 4), new Sprite("graphics/slime", 4));
    }

    public async tickBehaviour(gameState: Game) {
        super.tickBehaviour(gameState);
        
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



