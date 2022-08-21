import { Enemy } from "./Enemy";
import { Game } from "../Game";
import { ITickable } from "../roles/ITickable";
import { Level } from "./Level";

export class Playfield implements ITickable {
    public height = 480;
    public width = 640;
    public distanceTravelled = 0;
    public tickCount = 0;
    public enemies: Enemy[];
 
    public map: HTMLImageElement;
    public collisionMap: CanvasRenderingContext2D;

    constructor() {
        this.enemies = [];
    }

    public async init(level: Level) {
        this.map = new Image();
        this.map.src = level.foregroundUrl;
        
        const image = await new Promise<HTMLImageElement>((resolve, reject) => {
            var collisionMapImage = new Image();
            collisionMapImage.onload = (loadEvent: any) => {
                resolve(loadEvent.path[0]);
            };
            collisionMapImage.src = level.collisionUrl;
        });

        var hiddenCanvas = document.createElement("CANVAS") as HTMLCanvasElement;
        hiddenCanvas.setAttribute("width", image.width + "px");
        hiddenCanvas.setAttribute("height", image.height + "px");

        this.collisionMap = hiddenCanvas.getContext("2d");
        this.collisionMap.drawImage(image, 0, 0);

        level.onStart(this);
    }

    public async tick(gameState: Game) {
        this.tickCount++;
        this.distanceTravelled += gameState.player.velocityX;
        this.activateNearbyEnemies(gameState);
    }

    public activateNearbyEnemies(gameState: Game) {
        for (var i = 0; i < this.enemies.length; i++) {
            var distanceFromPlayer = Math.abs(gameState.player.x - this.enemies[i].x);
            if (distanceFromPlayer <= gameState.playfield.width * 2) {
                this.enemies[i].tick(gameState);
            }
        }
    }

    public getFloorBelowY(x, y) {
        for (var tempY = y; tempY <= this.height; tempY++) {
            if (this.isSolidSurface(x, tempY)) {
                return tempY;
            }
        }
        return 0;
    }

    public isSolidSurface(x: number, y: number) { return this.getPixelType(x, y) == "#"; }
    public isPit(x: number, y: number) { return this.getPixelType(x, y) == "pit"; }
    public isGoal(x: number, y: number) { return this.getPixelType(x, y) == "exit"; }


    public getPixelType(x: number, y: number) {
        if (!this.collisionMap) { 
            return "#"; 
        }

        const mapData = this.collisionMap.getImageData(x, y, 1, 1);
        var rawData = mapData.data;
        var mask = rawData[0] + " " + rawData[1] + " " + rawData[2] + " " + rawData[3];
        
        if (mask == "255 0 0 255")
            return "pit";

        if (mask == "76 255 0 255")
            return "exit";

        if (mask == "255 255 255 255")
            return ".";

        if (mask == "0 0 0 255")
            return "#";

        return "#";
    }

    public levelEndOffset() { return this.map.width - this.width; }

    public atLevelEnd() { return this.distanceTravelled >= this.levelEndOffset(); }

    public draw(gameState: Game) {
        var drawAtX = this.distanceTravelled * -1;
        //var drawAtX = gameState.player.x * -1;

        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        drawAtX = this.atLevelEnd() ? this.levelEndOffset() * -1 : drawAtX;

        gameState.ctx.drawImage(this.map, drawAtX, 0);

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw(gameState);
        }
    }
}
