import { Game } from "../Game";
import { Sprite } from "./Sprite";
import { Character } from "./Character";

export class Player extends Character {
    constructor() {
        super(180, 300, 56, 25, new Sprite("graphics/cat", 5), new Sprite("graphics/cat.backwards", 5));
    }

    public async tickBehaviour(gameState: Game) {
        if (gameState.playfield.isGoal(this.leadingEdge, this.y)) {
            gameState.stop({ reason: "completed" });
            return;
        }

        this.processControls(gameState);
        super.tickBehaviour(gameState);
    }

    private processControls(game: Game) {
        const bonusSpeed = game.controls.shift ? 2 : 0;

        if (game.controls.right) {
            this.velocityX = 5 + bonusSpeed;
        }

        if (game.controls.left) {
            this.velocityX = -5 - bonusSpeed;
        }

        if (!game.controls.left && !game.controls.right) {
            this.velocityX = 0;
        }

        if (game.controls.up && this.standingOnAPlatform(game)) {
            this.velocityY = 20 + bonusSpeed;
            game.sounds.jump();
        }
    }
}
