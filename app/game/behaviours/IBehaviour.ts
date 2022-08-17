import { Game } from "../Game";


export interface IBehaviour {
    act(gameState: Game): Promise<void | boolean>;
}
