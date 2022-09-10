import { lzw_encode, lzw_decode, SaveFile } from "../SaveFile";


export class LocalStorageGhostRepository {
    private callback: ((ghost: SaveFile) => void);

    constructor() {
    }

    public getGhosts(): SaveFile[] {
        const save = SaveFile.fromJson(lzw_decode(localStorage.getItem("save")));
        return [save];
    }

    public saveGhost(data: SaveFile): void {
        const str = JSON.stringify(data);
        const encoded = lzw_encode(str);

        localStorage.setItem("save", encoded);
        this.callback(data);
    }

    public onGhostAdded(callback: (ghost: SaveFile) => void) {
        this.callback = callback;
    }
}
