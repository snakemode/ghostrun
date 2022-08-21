import { Game } from "./game/Game";
    
const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
canvas.setAttribute("id", "game");
canvas.setAttribute("width", "640");
canvas.setAttribute("height", "480");
var ctx = canvas.getContext("2d");

const debugCheckbox = document.getElementById("debug") as HTMLInputElement;
const container = document.getElementById("container") as HTMLDivElement;
container.appendChild(canvas);    

const game = new Game();
game.debug = debugCheckbox.checked ? true : false;    
game.setRenderContext(ctx);
game.start();

debugCheckbox.addEventListener("change", (value: any) => {
    game.debug = value.target.checked;
    //game.start();
});

export { };