import { Game } from "./Game";

export class Controls {
    public up: boolean;
    public down: boolean;
    public left: boolean;
    public right: boolean;
    public space: boolean;
    public shift: boolean;

    private mapping = { 65: "left", 68: "right", 87: "up", 83: "down", 16: "shift", 32: "up" };

    public buttonPress(keyInfo: any) {
        this[this.mapping[keyInfo.keyCode]] = true;
    }

    public buttonRelease(keyInfo: any) {
        this[this.mapping[keyInfo.keyCode]] = false;
    }

    public connect(game: Game) {
        window.addEventListener("keydown", (keyInfo) => {
            game.controls.buttonPress(event); 
        }, false);

        window.addEventListener("keyup", (keyInfo) => { 
            game.controls.buttonRelease(event); 
        }, false);
    }
}
