import { Enemy } from "../entities/Enemy";
import { Level } from "../entities/Level";
import { Playfield } from "../entities/Playfield";
import { Game } from "../Game";

export class Level1 extends Level {

    constructor() {
        super("kitchen-bg.png", "kitchen-map.png");
    }

    public onStart(level: Playfield) {
        this.enemies.push(new Enemy(1000, 100));
        this.enemies.push(new Enemy(2000, 600));
        this.enemies.push(new Enemy(3700, 100));
        this.enemies.push(new Enemy(4000, 100));
        this.enemies.push(new Enemy(5600, 100));
        this.enemies.push(new Enemy(6500, 100));
        this.enemies.push(new Enemy(7600, 100));
    }
    
    public onTick(gameState: Game): void {
        for (var i = 0; i < this.enemies.length; i++) {
            var distanceFromPlayer = Math.abs(gameState.player.x - this.enemies[i].x);
            if (distanceFromPlayer <= gameState.playfield.width) {
                this.enemies[i].tick(gameState);
            }
        }
    }
}
