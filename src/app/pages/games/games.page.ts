/* tslint:disable:no-string-literal variable-name */
import {Component, OnInit, ViewChild} from '@angular/core';
import {Game} from '../../models/game.model';
import {Platform} from '../../models/platform.model';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {DatabaseService} from '../../services/database.service';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';
import {IonInfiniteScroll, ModalController} from '@ionic/angular';
import {SearchPage} from '../search/search.page';
import {FilterPage} from '../filter/filter.page';

@Component({
    selector: 'app-games',
    templateUrl: './games.page.html',
    styleUrls: ['./games.page.scss'],
})
export class GamesPage implements OnInit {
    @ViewChild(IonInfiniteScroll, {read: undefined, static: true}) infiniteScroll: IonInfiniteScroll;
    games: Game[] = [];
    platforms: Platform[] = [];
    selectedPlatform = '0'; // Needs to be a string in order to get default value.
    private page = 1; // Number of page to get from API.
    private maxPages = 50; // Max pages of games loaded without matching criteria.
    private controlMaxPages = 0; // While it's below maxPages it will keep loading games.
    private noResults = false; // Shows a message when no results are being displayed.
    private controlInfiniteScroll = 0;

    constructor(private barcodeScanner: BarcodeScanner, private _databaseService: DatabaseService,
                private _apiService: ApiService, private _authService: AuthService,
                private modalController: ModalController) {
        _apiService.getPlatforms().subscribe(platforms => {
            for (const platform of platforms['results']) {
                this.platforms.push(_apiService.dataToPlatform(platform));
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
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
                    this._databaseService.toast('Game not found in database.');
                }
            });
        }).catch(error => {
            this._databaseService.toast('There was an error loading the scanner.');
            console.log(error);
        });
    }

    goToGame(id: number) {
        this._apiService.goToGame(id);
    }

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
        this.noResults = false;
        this.page = 1;
        this.games = [];
        this.getGames();
    }

    loadMoreGames(event?) {
        setTimeout(() => {
            if (this.controlMaxPages < this.maxPages) {
                this.page++;
                this.getGames();
                if (event) {
                    event.target.complete();
                }
            }
        }, 500);
    }

    private getGames() {
        // tslint:disable-next-line:triple-equals
        if (this.selectedPlatform == '0') {
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
                    this._databaseService.getAverageLabelsData(newGame);
                } else {
                    if (labels['labels']) {
                        for (const labelData of labels['labels']) {
                            this._databaseService.getLabel(labelData).subscribe(label => {
                                newGame.labels.push(this._databaseService.dataToLabel(label));
                            });
                        }
                    } else {
                        this._databaseService.getAverageLabelsData(newGame);
                    }
                }
            });
            this.games.push(newGame);
            this.filterGames();
        }
    }

    // This method filters all shown games for the criteria specified for the user.
    // It has a limit that prevents the app to be stuck in a loop.
    filterGames() {
        if (this._databaseService.filters) {
            for (const game of this.games) {
                game.show = this._databaseService.matchesCriteria(game.labels);
            }
        }
        this.noResults = !this.checkIfAnyGameIsShown();
        if (!this.checkIfAnyGameIsShown() && this.controlMaxPages < this.maxPages) {
            this.loadMoreGames();
            this.controlMaxPages++;
        }
    }

    private checkIfAnyGameIsShown() {
        for (const game of this.games) {
            if (game.show) {
                return true;
            }
        }
        return false;
    }
}
