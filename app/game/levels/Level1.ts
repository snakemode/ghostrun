import { Enemy } from "../entities/Enemy";
import { Level } from "./Level";
import { Playfield } from "../entities/Playfield";
import { Game } from "../Game";
import { GifAsset } from "../entities/GifAsset";
import { Toast } from "../entities/Toast";

export class Level1 extends Level {
    constructor() {
        super("kitchen-bg.png", "kitchen-map.png");
    }

    public async onPreStart(level: Playfield) {
        this.addEntity(new GifAsset(5921, 255, "flame.gif"));
        this.addEntity(new GifAsset(5987, 255, "flame.gif"));
        this.addEntity(new GifAsset(5955, 275, "flame.gif"));
        this.addEntity(new GifAsset(7935, 270, "jam.gif"));
        this.addEntity(new GifAsset(2975, 137, "sponge.gif"));
        this.addEntity(new GifAsset(3072, 137, "sponge.gif"));
        this.addEntity(new Toast(3912, 166));
        this.addEntity(new Enemy(1000, 100));
        this.addEntity(new Enemy(2000, 600));
        this.addEntity(new Enemy(3700, 100));
        this.addEntity(new Enemy(4000, 100));
        this.addEntity(new Enemy(5600, 100));
        this.addEntity(new Enemy(6500, 100));
        this.addEntity(new Enemy(7600, 100));
        this.addEntity(new GifAsset(590, 150, "candle.gif", 10));
    }

    public async onStart(gameState: Game, level: Playfield) {
        //gameState.player.teleport(2850, 0);
        //gameState.playfield.cameraXposition = 2850;
    }
    
    public async onTick(gameState: Game) {
    }
}
