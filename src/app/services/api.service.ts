import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor( private http: HttpClient ) { }

  getGame( id: number ): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/games/${ id }`).pipe();
  }

  searchGames( search: string): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/games?page_size=40&search=${ search }`).pipe();
  }

}
