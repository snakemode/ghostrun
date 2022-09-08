export class Sprite {
    frames: any[];
    currentFrameId: number;

    constructor(filename: string, frameCount: number) {
        this.frames = [];
        this.currentFrameId = 1;

        for (var frameId = 1; frameId <= frameCount; frameId++) {
            var frame = new Image();
            frame.src = filename + "." + frameId + ".png";
            this.frames[frameId] = frame;
        }
    }

    draw(gameState, tickCount, x, y, height, width, ctx) {
        if (tickCount % 5 == 0) {
            this.currentFrameId++;
        }
        this.currentFrameId = this.currentFrameId >= this.frames.length ? 1 : this.currentFrameId;
        this.drawFrame(gameState, this.currentFrameId, x, y, height, width, ctx);
    }

    drawFrame(gameState, frameNumber, x, y, height, width, ctx) {
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