import {Component, OnInit} from '@angular/core';
import {Game} from '../../models/game.model';
import {Platform} from '../../models/platform.model';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {DatabaseService} from '../../services/database.service';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';
import {SearchPage} from '../search/search.page';
import {Label} from '../../models/label.model';
import {FilterPage} from '../filter/filter.page';

@Component({
    selector: 'app-games',
    templateUrl: './games.page.html',
    styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {

    games: Game[] = [];
    platforms: Platform[] = [];
    selectedPlatform = 0;
    private page = 1;

    constructor(private barcodeScanner: BarcodeScanner, private _databaseService: DatabaseService,
                private _apiService: ApiService, private _authService: AuthService, private modalController: ModalController) {
        _apiService.getPlatforms().subscribe(platforms => {
            for (const platform of platforms['results']) {
                this.platforms.push(_apiService.dataToPlatform(platform));
            }
        });
        /*_apiService.getDevelopers(1).subscribe(developers => {
            //console.log(developers['results']);
        })*/
    }

    ngOnInit(): void {
        this.loadGames();
    }

    scanGame() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log(barcodeData.text);
            this._databaseService.getBarcodeGame(barcodeData.text).subscribe(data => {
                if (data != null) {
                    this.goToGame(data['id']);
                } else {
                    // this.searchModal(barcodeData.text);
                }
            });
            console.log('Barcode Data', barcodeData);
            // this.barcode = barcodeData.text;
        }).catch(error => {
            console.log(error);
        });
    }

    goToGame(id: number) {
        this._apiService.goToGame(id);
    }

    // Admin barcode

    /*async searchModal(barcode: string) {
        const modal = await this.modalController.create({
            component: SearchPage
        });
        modal.onDidDismiss().then(game =>
            this._databaseService.addBarcodeGame(barcode, game.data)
        );
        return await modal.present();
    }*/

    async filterModal() {
        const modal = await this.modalController.create({
            component: FilterPage
        });
        modal.onDidDismiss().then(data => {
            this._databaseService.setFilter(data.data.filters);
            this.filterGames();
        });
        return await modal.present();
    }

    async searchModal() {
        const modal = await this.modalController.create({
            component: SearchPage
        });
        return await modal.present();
    }

    loadGames() {
        this.page = 1;
        this.games = [];
        this.getGames();
    }

    loadMoreGames(event) {
        setTimeout(() => {
            if (this.games.length === 20 * this.page) {
                this.page++;
                this.getGames();
            }
            event.target.complete();
        }, 500);
    }

    private getGames() {
        if (this.selectedPlatform === 0) {
            this._apiService.getGames(this.page).subscribe(games => {
                this.setGames(games.results);
            });
        } else {
            this._apiService.getGamesByPlatform(this.selectedPlatform, this.page).subscribe(games => {
                this.setGames(games.results);
            });
        }
    }

    private setGames(results: any) {
        for (const game of results) {
            const newGame = this._apiService.dataToGame(game);
            this._databaseService.getLabels(newGame.id).subscribe(labels => {
                newGame.labels = [];
                if (labels === undefined) {
                    console.log('Game not found in database');
                    // _databaseService.addGame(this.game.id);
                } else {
                    for (const labelData of labels['labels']) {
                        this._databaseService.getLabel(labelData).subscribe(label => {
                            newGame.labels.push(this._databaseService.dataToLabel(label));
                        });
                    }
                }
            });
            this.games.push(newGame);
            this.filterGames();
        }
    }

    filterGames() {
        if (this._databaseService.filters) {
            for (const game of this.games) {
                game.show = this._databaseService.matchesCriteria(game.labels);
            }
        }
    }
}
