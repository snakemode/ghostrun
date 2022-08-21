import { Game } from "../Game";
import { Enemy } from "./Enemy";
import { Playfield } from "./Playfield";

export abstract class Level {
    public foregroundUrl: string;
    public collisionUrl: string;
    public enemies: Enemy[];

    constructor(foregroundUrl: string, collisionUrl: string) {
        this.foregroundUrl = foregroundUrl;
        this.collisionUrl = collisionUrl;
        this.enemies = [];
    }

    abstract onStart(level: Playfield): void;
    abstract onTick(gameState: Game): void;
}
