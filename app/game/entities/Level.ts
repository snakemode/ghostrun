import { Enemy } from "./Enemy";
import { Game } from "../Game";
import { ITickable } from "../roles/ITickable";

export class Level implements ITickable {
    height = 480;
    width = 640;
    gravity = 10;
    distanceTravelled = 0;
    tickCount = 0;
    enemies: Enemy[];

    map: HTMLImageElement;
    collisionMap: any;

    constructor() {
        this.enemies = [];
    }

    tick(gameState: Game) {
        if (!this.map) {
            this.loadLevel(gameState);
            this.enemies.push(new Enemy(500, 100));
            this.enemies.push(new Enemy(2000, 100));
            this.enemies.push(new Enemy(3700, 100));
            this.enemies.push(new Enemy(4000, 100));
            this.enemies.push(new Enemy(5600, 100));
            this.enemies.push(new Enemy(6500, 100));
            this.enemies.push(new Enemy(7600, 100));
        }
        this.tickCount++;
        this.distanceTravelled += gameState.player.speed;
        this.activateNearbyEnemies(gameState);
    }

    activateNearbyEnemies(gameState: Game) {
        for (var i = 0; i < this.enemies.length; i++) {
            var distanceFromPlayer = Math.abs(gameState.player.x - this.enemies[i].x);
            if (distanceFromPlayer <= gameState.world.width * 2) {
                this.enemies[i].tick(gameState);
            }
        }
    }

    loadLevel(gameState: Game) {
        this.map = new Image();
        this.map.src = "level.png";

        var collisionMapImage = new Image();
        collisionMapImage.onload = (loadEvent) => {
            var hiddenCanvas = document.createElement("CANVAS") as HTMLCanvasElement;
            hiddenCanvas.setAttribute("width", this.width + "");
            hiddenCanvas.setAttribute("height", this.height + "");
            
            const context = hiddenCanvas.getContext("2d");
            context.drawImage(hiddenCanvas, 0, 0);
            this.collisionMap = context;
        };

        collisionMapImage.src = "level-map.png";
    }

    getFloorBelowY(x, y) {
        for (var tempY = y; tempY <= this.height; tempY++) {
            if (this.isSolidSurface(x, tempY)) {
                return tempY;
            }
        }
        return 0;
    }

    isSolidSurface(x, y) { return this.getPixelType(x, y) == "#"; }
    isPit(x, y) { return this.getPixelType(x, y) == "pit"; }
    isGoal(x, y) { return this.getPixelType(x, y) == "exit"; }

    getPixelType(x: number, y: number) {
        if (!this.collisionMap) { 
            return "."; 
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
    }

    levelEndOffset() { return this.map.width - this.width; }

    atLevelEnd() { return this.distanceTravelled >= this.levelEndOffset(); }

    draw(gameState: Game) {
        var drawAtX = this.distanceTravelled * -1;
        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        drawAtX = this.atLevelEnd() ? this.levelEndOffset() * -1 : drawAtX;

        gameState.ctx.drawImage(this.map, drawAtX, 0);

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw(gameState);
        }
    }
}
