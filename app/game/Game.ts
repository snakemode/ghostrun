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

    public async start() {
        await this.world.init();
        this.controls.connect(this);
        this.sounds.backgroundMusic();
        await this.loop();
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

    public async loop() {
        if (this.finished) {
            return;
        }

        await this.world.tick(this);
        await this.player.tick(this);

        if (this.ctx) {
            this.world.draw(this);
            this.player.draw(this);
        }

        this.timer = window.setTimeout(async () => {
            await this.loop();
        }, 1000 / 60);
    }
}
