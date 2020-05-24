export class List {

    constructor(id: string, name: string, games: number[]) {
        this.id = id;
        this.name = name;
        this.games = games;
    }

    id: string;
    name: string;
    games: number[];
}
