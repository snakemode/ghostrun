import { Game } from "../Game";


export interface ITickable {
    tick(gameState: Game): void;
}
