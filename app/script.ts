import { Game } from "./game/Game";
import { Player } from "./game/entities/Player";

document.getElementById("btn").addEventListener("click", () => {
    
    var canvas = document.createElement("CANVAS") as HTMLCanvasElement;
    canvas.setAttribute("id", "game");
    canvas.setAttribute("width", "640");
    canvas.setAttribute("height", "480");
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");

        
    const game = new Game();
    const player = new Player();

    game.addPlayer(player);
    console.log(player);

    game.setRenderContext(ctx);
    game.start();
});

export { };