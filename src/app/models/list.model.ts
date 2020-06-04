export class List {
    id: string;
    name: string;
    games: number[];

    constructor(id: string, name: string, games: number[]) {
        this.id = id;
        this.name = name;
        this.games = games;
    }
}
