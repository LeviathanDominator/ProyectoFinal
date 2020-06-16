import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Platform} from '../models/platform.model';
import {Game} from '../models/game.model';
import * as moment from 'moment';
import {Movie} from '../models/movie.model';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private url = 'https://api.rawg.io/api/';

    constructor(private http: HttpClient, private router: Router) {
    }

    getGame(id: number): Observable<any> {
        return this.http.get(`${this.url}games/${id}`).pipe();
    }

    getGames(page: number, orderBy: string): Observable<any> {
        // tslint:disable-next-line:triple-equals
        if (orderBy.length == 0) {
            return this.http.get(`${this.url}games?page=${page}`).pipe();
        } else {
            return this.http.get(`${this.url}games?page=${page}&ordering=${orderBy}`).pipe();
        }
    }

    getGamesByPlatform(platform: string, page: number, orderBy: string): Observable<any> {
        // tslint:disable-next-line:triple-equals
        if (orderBy.length == 0) {
            return this.http.get(`${this.url}games?platforms=${platform}&page=${page}`).pipe();
        } else {
            return this.http.get(`${this.url}games?platforms=${platform}&page=${page}&ordering=${orderBy}`).pipe();
        }
    }

    searchGames(search: string): Observable<any> {
        return this.http.get(`${this.url}games?page_size=40&search=${search}`).pipe();
    }

    goToGame(id: number): void {
        this.router.navigate(['/game', id]);
    }

    // Gets game data and returns a Game object.
    dataToGame(data: any): Game {
        const released = moment(data.released, 'YYYY-MM-DD').toDate();
        return new Game(data.id, data.name, data.description_raw, data.background_image, released,
            data.short_screenshots, data.esrb_rating ? data.esrb_rating.name : '', data.developers,
            data.rating, data.stores, data.reddit_url);
    }

    getSimilarGames(id: number): Observable<any> {
        return this.http.get(`${this.url}games/${id}/suggested`).pipe();
    }

    getMovies(id: number): Observable<any> {
        return this.http.get(`${this.url}games/${id}/movies`).pipe();
    }

    dataToMovies(moviesData: any): any[] {
        const movies = [];
        for (const movie of moviesData.results) {
            movies.push(new Movie(movie.name, movie.data.max, movie.preview));
        }
        return movies;
    }

    getScreenshots(id: number): Observable<any> {
        return this.http.get(`${this.url}games/${id}/screenshots`).pipe();
    }

    dataToScreenshots(screenshotsData: any): any[] {
        const screenshots = [];
        for (const screenshot of screenshotsData.results) {
            screenshots.push(screenshot.image);
        }
        return screenshots;
    }

    // Gets platform data and returns a Platform object.
    dataToPlatform(data: any): Platform {
        return new Platform(data.id, data.name, data.description, data.image_background, data.games_count);
    }

    getPlatforms(): Observable<any> {
        return this.http.get(`${this.url}platforms`).pipe();
    }

    getPlatform(id: string): Observable<any> {
        return this.http.get(`${this.url}platforms/${id}`).pipe();
    }

    goToPlatform(id: number): void {
        this.router.navigate(['/platform', id]);
    }
}
