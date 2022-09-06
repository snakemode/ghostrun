import { Controls } from "./Controls";
import { Sounds } from "./Sounds";
import { Player } from "./entities/Player";
import { Playfield } from "./entities/Playfield";
import { Level1 } from "./levels/Level1";

export class Game {
    private timer: any;
    private finished: boolean;

    public controls: Controls;
    public sounds: Sounds;
    public playfield: Playfield;
    public player: Player;
    
    public debug: boolean;

    constructor(width: number = 640, height: number = 480) {
        this.debug = false;
        this.finished = false;
        this.controls = new Controls();
        this.sounds = new Sounds(false);

        this.playfield = new Playfield(this, width, height);
        this.player = null;
    }

    public async start() {
        if (this.timer) {
            this.finished = false;
            window.clearTimeout(this.timer);
        }

        this.player = new Player();

        await this.playfield.init(new Level1());
        
        this.controls.connect(this);
        this.sounds.backgroundMusic();
        await this.loop();
    }

    public stop(message: { reason: string }) {
        this.finished = true;
        console.log("Game ended:", message.reason);
        window.clearTimeout(this.timer);
    }

    public async loop() {
        if (this.finished) {
            return;
        }

        await this.playfield.tick(this);
        await this.player.tick(this);

        if (this.playfield.ctx) {
            this.playfield.draw(this);
            this.player.draw(this);
        }

        this.timer = window.setTimeout(async () => {
            await this.loop();
        }, 1000 / 60);
    }
}
