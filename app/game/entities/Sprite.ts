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

    draw(tickCount, x, y, height, width, ctx) {
        if (tickCount % 5 == 0) {
            this.currentFrameId++;
        }
        this.currentFrameId = this.currentFrameId >= this.frames.length ? 1 : this.currentFrameId;
        this.drawFrame(this.currentFrameId, x, y, height, width, ctx);
    }

    drawFrame(frameNumber, x, y, height, width, ctx) {
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(x, y, width - 1, height - 1);
        ctx.stroke();
        ctx.drawImage(this.frames[frameNumber], x, y, width, height);
    }
}
