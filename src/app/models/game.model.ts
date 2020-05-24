import {Label} from './label.model';
import {Platform} from './platform.model';

export class Game {
    constructor(id: number, title: string, description?: string, image?: string, screenshots?: string[], esrb?: string) {
        this.id = id;
        this.title = title;
        this.description = description ? description : '';
        this.image = image;
        this.screenshots = screenshots;
        this.esrb = esrb ? esrb : 'None';
        this.platforms = [];
        this.labels = [];
        this.show = true;
    }

    id: number;
    title: string;
    description: string;
    dlcDescription: string;
    avgCompletion: number[];
    image: string;
    screenshots: string[];
    esrb: string;
    platforms: Platform[];
    labels: Label[];
    show: boolean;


}
