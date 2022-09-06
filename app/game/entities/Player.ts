import { Game } from "../Game";
import { Sprite } from "./Sprite";
import { Character } from "./Character";
import { SaveFile } from "./SaveFile";

export class Player extends Character {
    public saveFile: SaveFile;

    constructor() {
        super(360, 300, 30, 30, new Sprite("graphics/player", 5), new Sprite("graphics/player.backwards", 5));
        this.saveFile = new SaveFile();
    }

    public async tickBehaviour(gameState: Game) {
        if (gameState.playfield.isGoal(this.leadingEdge, this.y)) {
            gameState.stop({ reason: "completed" });
            return;
        }

        if (!gameState.player.isAlive) {
            gameState.stop({ reason: "dead" });
            return;
        }

        this.processControls(gameState);
        super.tickBehaviour(gameState);

        this.saveFile.push(this.x, this.y);
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
