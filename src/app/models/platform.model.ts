export class Platform {
    constructor(id: number, name: string, description?: string, image?: string, gamesCount?: number) {
        this.id = id;
        this.name = name;
        this.description = this.removeTags(description);
        this.image = image;
        this.gamesCount = gamesCount;
    }

    // Removes unnecessary HTML code.
    private removeTags(text: string) {
        if (text == undefined){
            return "";
        }
        return text.replace("<p>", "")
            .replace("</p>", "")
            .replace("&#39;", "'")
            .replace("<br />", "");
    }

    id: number;
    name: string;
    description: string;
    image: string;
    gamesCount: number;
}
