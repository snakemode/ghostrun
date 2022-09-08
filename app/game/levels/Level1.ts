import { Enemy } from "../entities/Enemy";
import { activateWhenNearPlayer, Level } from "./Level";
import { Playfield } from "../entities/Playfield";
import { Game } from "../Game";

export class Level1 extends Level {

    constructor() {
        super("kitchen-bg.png", "kitchen-map.png");
    }

    public onStart(level: Playfield) {
        this.addEntity(new Enemy(1000, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(2000, 600), activateWhenNearPlayer);
        this.addEntity(new Enemy(3700, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(4000, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(5600, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(6500, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(7600, 100), activateWhenNearPlayer);
    }
    
    public onTick(gameState: Game): void {

    }
}
