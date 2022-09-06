import { lzw_encode, lzw_decode } from "./game/compression/LZString";
import { SaveFile } from "./game/entities/SaveFile";
import { Game } from "./game/Game";
    
const debugCheckbox = document.getElementById("debug") as HTMLInputElement;
const container = document.getElementById("container") as HTMLDivElement;

const game = new Game(window.innerWidth - 20, 480);

game.onGameEnd((reason: string, data: SaveFile) => {
    console.log("Game ended:", reason, data);
    console.log("Recorded", data, "frames of input");

    const str = JSON.stringify(data);
    const encoded = lzw_encode(str);
    localStorage.setItem("save", encoded);
})

if (localStorage.getItem("save")) {
    const save = SaveFile.fromJson(lzw_decode(localStorage.getItem("save")));
    console.log("loaded save from local storage", save);
    game.addGhost(save);
}

container.appendChild(game.playfield.canvas);  
game.debug = debugCheckbox.checked ? true : false; 

game.start();

debugCheckbox.addEventListener("change", (value: any) => {
    game.debug = value.target.checked;
    //game.start();
});

export { };