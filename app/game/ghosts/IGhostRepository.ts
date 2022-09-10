import { SaveFile } from "../SaveFile";

export interface IGhostRepository {
    getGhosts(): SaveFile[];
    saveGhost(data: SaveFile): void;
    onGhostAdded(callback: (ghost: SaveFile) => void): void;
}

