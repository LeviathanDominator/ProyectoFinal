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

    getGames(page: number): Observable<any> {
        return this.http.get(`${this.url}games?page=${page}`).pipe();
    }

    getGamesByPlatform(platform: string, page: number): Observable<any> {
        return this.http.get(`${this.url}games?platforms=${platform}&page=${page}`).pipe();
    }

    searchGames(search: string): Observable<any> {
        return this.http.get(`${this.url}games?page_size=40&search=${search}`).pipe();
    }

    goToGame(id: number) {
        this.router.navigate(['/game', id]);
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

    dataToGame(data: any) {
        return new Game(data.id, data.name, data.description_raw, data.background_image,
            data.short_screenshots, data.esrb_rating ? data.esrb_rating.name : '');
    }

    dataToPlatform(data: any) {
        return new Platform(data.id, data.name, data.description, data.image_background, data.games_count);
    }
}
