/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {ApiService} from '../../services/api.service';
import {DatabaseService} from '../../services/database.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    searchedGames: any = [];

    constructor(private modalCtrl: ModalController, private _apiService: ApiService,
                private _databaseService: DatabaseService, private alertController: AlertController) {
        this.searchGames(undefined);
    }

    ngOnInit() {
    }

    searchGames(searched: any) {
        let value = '';
        if (searched) {
            value = searched.target.value;
        }
        this._apiService.searchGames(value).pipe().subscribe(search => {
            this.searchedGames = search.results;
            return search;
        }, error => {
            this._databaseService.noConnectionAlert();
            return error;
        });
    }

    goToGame(game: any) {
        this.modalCtrl.dismiss({
            dismissed: true
        });
        this._apiService.goToGame(game.id);
    }

}
