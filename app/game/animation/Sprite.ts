import { ITickable } from "../behaviours/ITickable";
import { Game } from "../Game";

export type Direction = "left" | "right";

export class Sprite implements ITickable {
    private frames: any[];
    private currentFrameId: number;
    private facing: "left" | "right";

    public get firstFrame() { return this.frames[1]; }
    public get currentFrame() { return this.frames[this.currentFrameId]; }
    public get lastFrame() { return this.frames[this.frames.length - 1]; }

    constructor(filename: string, frameCount: number) {
        this.frames = [];
        this.currentFrameId = 1;
        this.facing = "right";

        for (var frameId = 1; frameId <= frameCount; frameId++) {
            var frame = new Image();
            frame.src = filename + "." + frameId + ".png";
            this.frames[frameId] = frame;
        }
    }
    
    public async tick(gameState: Game){        
        if (gameState.playfield.tickCount % 5 == 0) {
            this.currentFrameId++;
        }

        this.currentFrameId  = this.currentFrameId >= this.frames.length ? 1 : this.currentFrameId
    }

    public setDirection(facing: Direction) {
        if (this.facing === facing) {
            return;
        }

        this.facing = facing;
        this.frames.forEach(frame => {
            var canvas = document.createElement("canvas");
            canvas.width = frame.width;
            canvas.height = frame.height;
            
            var context = canvas.getContext("2d");
            context.translate(frame.width, 0);
            context.scale(-1, 1);
            context.drawImage(frame, 0, 0);
            frame.src = canvas.toDataURL();
        });
    }

    public draw(gameState, x, y, height, width, ctx) {
        this.drawFrame(gameState, this.currentFrameId, x, y, height, width, ctx);
    }

    public drawFrame(gameState, frameNumber, x, y, height, width, ctx) {
        const canvasY = gameState.playfield.height - y - height;

        if (gameState.debug) {
            ctx.beginPath();
            ctx.lineWidth = "1";
            ctx.strokeStyle = "red";
            ctx.rect(x, canvasY, width, height);
            ctx.stroke();
        }        

        ctx.drawImage(this.frames[frameNumber], x, canvasY, width, height);
    }
}
