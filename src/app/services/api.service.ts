import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {Platform} from '../models/platform.model';
import {Game} from '../models/game.model';

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

    getScreenshots(id: number): Observable<any> {
        return this.http.get(`${this.url}games/${id}/screenshots`).pipe();
    }

    dataToScreenshots(screenshotsData: any) {
        const screenshots = [];
        for (const screenshot of screenshotsData.results) {
            screenshots.push(screenshot.image);
        }
        return screenshots;
    }

    getGames(page: number, orderBy: string): Observable<any> {
        console.log(orderBy);
        // tslint:disable-next-line:triple-equals
        if (orderBy.length == 0) {
            return this.http.get(`${this.url}games?page=${page}`).pipe();
        } else {
            return this.http.get(`${this.url}games?page=${page}&ordering=${orderBy}`).pipe();
        }
    }

    getGamesByPlatform(platform: string, page: number, orderBy): Observable<any> {
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

    goToGame(id: number) {
        this.router.navigate(['/game', id]);
    }

    dataToGame(data: any) {
        return new Game(data.id, data.name, data.description_raw, data.background_image, data.released,
            data.short_screenshots, data.esrb_rating ? data.esrb_rating.name : '', data.developers,
            data.rating, data.stores);
    }

    dataToPlatform(data: any) {
        return new Platform(data.id, data.name, data.description, data.image_background, data.games_count);
    }

    getPlatforms() {
        return this.http.get(`${this.url}platforms`).pipe();
    }

    getPlatform(id: string) {
        return this.http.get(`${this.url}platforms/${id}`).pipe();
    }

    goToPlatform(id: number) {
        this.router.navigate(['/platform', id]);
    }
}
