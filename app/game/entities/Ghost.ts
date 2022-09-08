import { Game } from "../Game";
import { Sprite } from "../animation/Sprite";
import { Character } from "./Character";
import { SaveFile } from "../SaveFile";

export class Ghost extends Character {
    private saveFile: SaveFile;
    
    constructor(saveFile: SaveFile) {        
        const { x, y } = saveFile.recording[0];
        super(x, y, 25, 25, new Sprite("graphics/slime", 4));
        
        this.clearBehaviours();
        this.saveFile = saveFile;
    }

    public async onTick(gameState: Game) {   
        if (this.saveFile.recording.length > 0) {
            const { x, y } = this.saveFile.recording.shift();
            this.x = x;
            this.y = y;
        } else {
            // Do something else!
        }
    }

    public get isAlive() {
        return this.saveFile.recording.length > 0;
    }
}
