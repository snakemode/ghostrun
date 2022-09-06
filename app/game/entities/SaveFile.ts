export interface Coordinate {
    x: number;
    y: number;
}

export class SaveFile {
    public recording: Coordinate[];
    public date: Date;

    constructor(date: Date = new Date()) {
        this.recording = [];
        this.date = date;
    }

    public push(x: number, y: number) {
        this.recording.push({ x, y });
    }

    public static fromJson(json: string): SaveFile {
        const saveFile = new SaveFile();
        const parsed = JSON.parse(json);
        saveFile.recording = parsed.recording;
        saveFile.date = new Date(parsed.date);
        return saveFile;
    }
}
