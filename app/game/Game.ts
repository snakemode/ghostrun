import { Controls } from "./Controls";
import { Sounds } from "./Sounds";
import { Player } from "./entities/Player";
import { Level } from "./entities/Level";

export class Game {
    private timer: any;
    private finished: boolean;

    public controls: Controls;
    public sounds: Sounds;
    public world: Level;
    public player: Player;
    
    public ctx: CanvasRenderingContext2D;

    constructor() {
        this.finished = false;
        this.controls = new Controls();
        this.sounds = new Sounds(false);

        this.world = new Level();
        this.player = null;
    }

    public start() {
        this.controls.connect(this);
        this.sounds.backgroundMusic();
        this.loop();
    }

    public stop() {
        this.finished = true;
        window.clearTimeout(this.timer);
    }

    public setRenderContext(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public addPlayer(player: Player) {
        this.player = player;
    }

    public loop() {
        if (this.finished) {
            return;
        }

        this.world.tick(this);
        this.player.tick(this);

        if (this.ctx) {
            this.world.draw(this);
            this.player.draw(this);
        }

        this.timer = window.setTimeout(() => {
            this.loop();
        }, 1000 / 60);
    }
}
