export class Label {
    constructor(id: string, name: string, description: string, descriptionLarge: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.descriptionLarge = descriptionLarge;
        this.selectedFilter = "any";
    }

    id: string;
    name: string;
    description: string;
    descriptionLarge: string;
    selectedFilter: string;
}
