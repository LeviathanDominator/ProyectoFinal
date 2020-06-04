import {Filter} from './filter.model';

export class Label {
    id: number;
    name: string;
    description: string;
    descriptionLarge: string;
    selectedFilter: Filter;

    constructor(id: number, name: string, description: string, descriptionLarge: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.descriptionLarge = descriptionLarge;
        this.selectedFilter = Filter.any;
    }
}
