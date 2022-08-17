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

    public async init() {
        this.map = new Image();
        this.map.src = "level.png";

        await new Promise<void>((resolve, reject) => {

            var collisionMapImage = new Image();

            collisionMapImage.onload = (loadEvent: any) => {
                const image = loadEvent.path[0];
                

                var hiddenCanvas = document.createElement("CANVAS") as HTMLCanvasElement;
                hiddenCanvas.setAttribute("width", this.width + "px");
                hiddenCanvas.setAttribute("height", this.height + "px");
                
                this.collisionMap = hiddenCanvas.getContext("2d");
                this.collisionMap.drawImage(hiddenCanvas, 0, 0);

                console.log("collision map loaded", loadEvent);
                resolve();
            };

            collisionMapImage.src = "level-map.png";
        });
    }

    public async tick(gameState: Game) {
        if (!this.map) {
            await this.init();
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

    public activateNearbyEnemies(gameState: Game) {
        for (var i = 0; i < this.enemies.length; i++) {
            var distanceFromPlayer = Math.abs(gameState.player.x - this.enemies[i].x);
            if (distanceFromPlayer <= gameState.world.width * 2) {
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

    public isSolidSurface(x, y) { return this.getPixelType(x, y) == "#"; }
    public isPit(x, y) { return this.getPixelType(x, y) == "pit"; }
    public isGoal(x, y) { return this.getPixelType(x, y) == "exit"; }

    public getPixelType(x: number, y: number) {
        if (!this.collisionMap) { 
            return "."; 
        }

        const mapData = this.collisionMap.getImageData(x, y, 1, 1);
        var rawData = mapData.data;
        var mask = rawData[0] + " " + rawData[1] + " " + rawData[2] + " " + rawData[3];
        
        //console.log("getPixelType", arguments, mask);

        if (mask == "255 0 0 255")
            return "pit";

        if (mask == "76 255 0 255")
            return "exit";

        if (mask == "255 255 255 255")
            return ".";

        if (mask == "0 0 0 255")
            return "#";
    }

    public levelEndOffset() { return this.map.width - this.width; }

    public atLevelEnd() { return this.distanceTravelled >= this.levelEndOffset(); }

    public draw(gameState: Game) {
        var drawAtX = this.distanceTravelled * -1;
        drawAtX = drawAtX > 0 ? 0 : drawAtX;
        drawAtX = this.atLevelEnd() ? this.levelEndOffset() * -1 : drawAtX;

        gameState.ctx.drawImage(this.map, drawAtX, 0);

        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw(gameState);
        }
    }
}
