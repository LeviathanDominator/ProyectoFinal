export class Movie {
    name: string;
    movieUrl: string;
    imageUrl: string;

    constructor(name: string, movieUrl: string, imageUrl: string) {
        this.name = name;
        this.movieUrl = movieUrl;
        this.imageUrl = imageUrl;
    }
}
