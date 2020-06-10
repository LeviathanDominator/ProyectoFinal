export class Platform {
    id: number;
    name: string;
    description: string;
    image: string;
    gamesCount: number;

    constructor(id: number, name: string, description?: string, image?: string, gamesCount?: number) {
        this.id = id;
        this.name = name;
        this.description = this.removeTags(description);
        this.image = image;
        this.gamesCount = gamesCount;
    }

    // Removes unnecessary HTML code.
    private removeTags(text: string): string {
        // tslint:disable-next-line:triple-equals
        if (text == undefined) {
            return '';
        }
        return text.replace('<p>', '')
            .replace('</p>', '')
            .replace('&#39;', '\'')
            .replace('<br />', '');
    }
}
