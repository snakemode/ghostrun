export async function loadImage(url: string) {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
        var i = new Image();
        i.onload = (loadEvent: any) => {
            resolve(loadEvent.path[0]);
        };
        i.src = url;
    });
}