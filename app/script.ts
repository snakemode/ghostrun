import { Game } from "./game/Game";
    

const debugCheckbox = document.getElementById("debug") as HTMLInputElement;
const container = document.getElementById("container") as HTMLDivElement;

const game = new Game(window.innerWidth - 20, 480);

container.appendChild(game.playfield.canvas);  
game.debug = debugCheckbox.checked ? true : false; 
game.start();

debugCheckbox.addEventListener("change", (value: any) => {
    game.debug = value.target.checked;
    //game.start();
});

export { };