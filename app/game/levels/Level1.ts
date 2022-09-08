import { Enemy } from "../entities/Enemy";
import { activateWhenNearPlayer, Level } from "./Level";
import { Playfield } from "../entities/Playfield";
import { Game } from "../Game";
import { GifAsset } from "../entities/GifAsset";
import { Toast } from "../entities/Toast";

export class Level1 extends Level {
    constructor() {
        super("kitchen-bg.png", "kitchen-map.png");
    }

    public async onPreStart(level: Playfield) {
        this.addEntity(new GifAsset(450, 114, "candle.gif"), activateWhenNearPlayer);
        this.addEntity(new Toast(3912, 166), activateWhenNearPlayer);
        this.addEntity(new Enemy(1000, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(2000, 600), activateWhenNearPlayer);
        this.addEntity(new Enemy(3700, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(4000, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(5600, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(6500, 100), activateWhenNearPlayer);
        this.addEntity(new Enemy(7600, 100), activateWhenNearPlayer);
    }

    public async onStart(level: Playfield) {
    }
    
    public async onTick(gameState: Game) {
    }
}
