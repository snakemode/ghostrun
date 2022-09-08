export class ImageLoader {
    public static cache = new Map<string, HTMLImageElement>();    

    public static async load(url: string) {
        url = url.trim();

        if (ImageLoader.cache.has(url)) {
            //console.log("ImageLoader: Cache hit for", url);
            return ImageLoader.cache.get(url);
        }
            
        return await new Promise<HTMLImageElement>((resolve, reject) => {
            var i = new Image();
            i.onload = (loadEvent: any) => {
                //console.log("loaded ", url);

                ImageLoader.cache.set(url, loadEvent.path[0]);    
                resolve(loadEvent.path[0]);
            };
            i.src = url;
        });
    }
}