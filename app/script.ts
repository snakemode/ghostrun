import { SaveFile } from "./game/SaveFile";
import { AblyGhostRepository } from "./game/ghosts/AblyGhostRepository";
import { Game } from "./game/Game";
import { LocalStorageGhostRepository } from "./game/ghosts/LocalStorageGhostRepository";
    
const debugCheckbox = document.getElementById("debug") as HTMLInputElement;
const container = document.getElementById("container") as HTMLDivElement;

const game = new Game(window.innerWidth - 20, 552);
const ghostRepository = new LocalStorageGhostRepository();

ghostRepository.onGhostAdded((ghost: SaveFile) => {
    game.addGhost(ghost);
});

game.onGameEnd((reason: string, data: SaveFile) => {
    console.log("Game ended:", reason, data);
    console.log("Recorded", data, "frames of input");
    ghostRepository.saveGhost(data);
});

container.appendChild(game.playfield.canvas);  
game.debug = debugCheckbox.checked ? true : false; 

game.start();

debugCheckbox.addEventListener("change", (value: any) => {
    game.debug = value.target.checked;
    //game.start();
});

export { };
