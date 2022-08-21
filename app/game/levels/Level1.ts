import { Enemy } from "../entities/Enemy";
import { Level } from "../entities/Level";
import { Playfield } from "../entities/Playfield";

export class Level1 extends Level {
    constructor() {
        super("level-map.png", "level-map.png");
    }

    public onStart(level: Playfield) {
        /*level.enemies.push(new Enemy(500, 100));
        level.enemies.push(new Enemy(2000, 100));
        level.enemies.push(new Enemy(3700, 100));
        level.enemies.push(new Enemy(4000, 100));
        level.enemies.push(new Enemy(5600, 100));
        level.enemies.push(new Enemy(6500, 100));
        level.enemies.push(new Enemy(7600, 100));*/
    }
}
