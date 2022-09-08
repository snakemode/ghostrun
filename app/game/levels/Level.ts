import { Game } from "../Game";
import { IDrawable, isDrawable } from "../behaviours/IDrawable";
import { isTickable, ITickable } from "../behaviours/ITickable";
import { Playfield } from "../entities/Playfield";

export abstract class Level {
    public foregroundUrl: string;
    public collisionUrl: string;

    private entityRegistrations: EntityRegistration[];
    public get entities() { return this.entityRegistrations.map(x => x.entity); }

    constructor(foregroundUrl: string, collisionUrl: string) {
        this.foregroundUrl = foregroundUrl;
        this.collisionUrl = collisionUrl;
        this.entityRegistrations = [];
    }

    protected addEntity(entity: GamePlayEntity, activationCondition: EntityActivationCallback = alwaysActivate) {
        const entityRegistration = {
            entity: entity,
            activationCondition: activationCondition
        };
        
        this.entityRegistrations.push(entityRegistration);
    }

    public tick(gameState: Game): void {
        
        for (const { entity, activationCondition } of this.entityRegistrations) {            
            if (activationCondition(gameState, entity) && isTickable(entity)) {
                entity.tick(gameState);
            }
        }

        this.onTick(gameState);
    }        

    abstract onStart(level: Playfield): void;
    abstract onTick(gameState: Game): void;
}

export type GamePlayEntity = ITickable | IDrawable;
export type EntityActivationCallback = (gameState: Game, entity: GamePlayEntity) => boolean;
export type EntityRegistration = {
    entity: GamePlayEntity;
    activationCondition: EntityActivationCallback;
};

export function alwaysActivate(gameState: Game, entity: GamePlayEntity) {
    return true;
}

export function activateWhenNearPlayer(gameState: Game, entity: GamePlayEntity): boolean {
    return isDrawable(entity) 
            ? entity.x < gameState.playfield.distanceTravelled + gameState.playfield.width 
            : alwaysActivate(gameState, entity);
}