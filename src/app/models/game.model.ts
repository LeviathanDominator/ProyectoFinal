import {Label} from "./label.model";
import {Platform} from "./platform.model";
import {Observable} from "rxjs";

export class Game {
    constructor(id: number, title: string, description?: string, image?: string, screenshots?: string[], esrb?: string) {
        this.id=id;
        this.title = title;
        this.description = description ? description : "";
        this.image = image;
        this.screenshots = screenshots;
        this.esrb = esrb ? esrb : "";
        this.platforms = [];
        this.labels = [];
    }

    id: number;
    title: string;
    description: string;
    image: string;
    screenshots: string[];
    esrb: string;
    platforms: Platform[];
    labels: Label[];


}
