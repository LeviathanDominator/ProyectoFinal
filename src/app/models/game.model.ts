import {Label} from "./label.model";

export class Game {
    id: number;
    title: string;
    description: string;
    rating: string;
    image: string;
    release_date: string;
    screenshots: string[];
    labels: Label[];
}
