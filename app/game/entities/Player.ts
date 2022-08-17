import { Game } from "../Game";
import { Sprite } from "./Sprite";
import { Character } from "./Character";

export class Player extends Character {
    constructor() {
        super(160, 390, 25, 25, new Sprite("graphics/cat", 5), new Sprite("graphics/cat.backwards", 5));
    }

    public tick(gameState: Game) {
        if (gameState.world.isGoal(this.leadingEdge(), this.y)) {
            gameState.stop();
            return;
        }

        if (!this.isAlive) {
            return;
        }

        this.processControls(gameState);
        super.tick(gameState);
    }

    private processControls(game: Game) {
        if (game.controls.right) {
            this.speed = 5;
        }

        if (game.controls.left) {
            this.speed = -5;
        }

        if (!game.controls.left && !game.controls.right) {
            this.speed = 0;
        }

        if (game.controls.up && this.standingOnAPlatform(game)) {
            this.downwardForce = -8;
            game.sounds.jump();
        }
    }
}
