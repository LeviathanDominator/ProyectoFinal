import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {ApiService} from "../../services/api.service";
import {DatabaseService} from "../../services/database.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    private searchedGames: any = [];

    // tslint:disable-next-line:variable-name
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
            return error;
        });
    }

    goToGame(game: any) {
        this.modalCtrl.dismiss({
            dismissed: true
        });
        this._apiService.goToGame(game.id);
    }

    // TODO ONLY ADMIN SHOULD DO THIS
    async returnId(game: any) {
        const id: number = game.id;
        const alert = await this.alertController.create({
            header: 'Adding game',
            message: 'Add ' + game.name + ' to barcode database?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        console.log('Cancel');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.modalCtrl.dismiss(id).then(() => console.log(game.name + ' added to database.'));
                    }
                }
            ]
        });
        await alert.present();
    }

}
