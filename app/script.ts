import { Game } from "./game/Game";
import { Player } from "./game/entities/Player";

document.getElementById("btn").addEventListener("click", () => {
    
    var canvas = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.setAttribute("id", "game");
    canvas.setAttribute("width", "640");
    canvas.setAttribute("height", "480");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
        
    const player = new Player();
    const game = new Game();
    
    game.addPlayer(player);
    game.setRenderContext(ctx);
    game.start();
});

export { };