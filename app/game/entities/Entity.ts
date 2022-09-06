import { Game } from "../Game";
import { IBehaviour } from "../behaviours/IBehaviour";

export abstract class Entity {
    public id: string;
    public x: number;
    public y: number;
    public height: number;
    public width: number;

    private behaviours: Map<string, IBehaviour>;

    constructor(x: number, y: number, width: number, height: number) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;

        this.behaviours = new Map<string, IBehaviour>();
    }

    public async tick(gameState: Game) {
        this.beforeTick(gameState);

        for (const [key, behaviour] of this.behaviours.entries()) {
            const response = await behaviour.act(gameState);

            if (response === undefined) {
                continue;
            }
            
            if (response === false) {
                return;
            }
        }

        this.tickBehaviour(gameState);
    }


    abstract beforeTick(gameState: Game): Promise<void>;
    abstract tickBehaviour(gameState: Game): Promise<void | CallableFunction | false>;

    public addBehaviour(key: string, behaviour: IBehaviour) {
        this.behaviours.set(key, behaviour);
    }

    public behaviour<T = any>(key: string) {
        return this.behaviours.get(key) as T;
    }

    public hasBehaviour(key: string, callback: (behaviour: IBehaviour) => void) {
        if (this.behaviours.has(key)) {
            callback(this.behaviours.get(key));
        }
    }
}
