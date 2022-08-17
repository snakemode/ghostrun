import { Playfield } from "./Playfield";

export abstract class Level {
    public foregroundUrl: string;
    public collisionUrl: string;

    constructor(foregroundUrl: string, collisionUrl: string) {
        this.foregroundUrl = foregroundUrl;
        this.collisionUrl = collisionUrl;
    }

    abstract onStart(level: Playfield): void;
}
