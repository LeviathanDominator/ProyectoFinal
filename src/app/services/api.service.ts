import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private url = "https://api.rawg.io/api/";

    constructor(private http: HttpClient, private router: Router) {
    }

    getGame(id: number): Observable<any> {
        return this.http.get(`${this.url}games/${id}`).pipe();
    }

    getGames(): Observable<any> {
        return this.http.get(`${this.url}games`).pipe();
    }

    getGamesByPlatform(platform: number, page: number): Observable<any> {
        return this.http.get(`${this.url}games?platforms=${platform}&page=${page}`).pipe();
    }

    searchGames(search: string): Observable<any> {
        return this.http.get(`${this.url}games?page_size=40&search=${search}`).pipe();
    }

    goToGame(id: number) {
        this.router.navigate(['/game', id]);
    }

    getPlatforms(page: number) {
        return this.http.get(`${this.url}platforms?page=${page}`).pipe();
    }

    getGenres(page: number) {
        return this.http.get(`${this.url}genres?page=${page}`).pipe();
    }

    getDevelopers(page: number) {
        return this.http.get(`${this.url}developers?page=${page}`).pipe();
    }

}
