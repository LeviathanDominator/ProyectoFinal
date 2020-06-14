/* tslint:disable:no-string-literal variable-name */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Game} from '../../models/game.model';
import {ApiService} from '../../services/api.service';
import {DatabaseService} from '../../services/database.service';
import {ModalController} from '@ionic/angular';
import {LabelinputPage} from '../labelinput/labelinput.page';
import {Platform} from '../../models/platform.model';
import {AuthService} from '../../services/auth.service';
import {AddToListPage} from '../add-to-list/add-to-list.page';
import {PhotoViewer} from '@ionic-native/photo-viewer/ngx';
import {VideoPlayer} from '@ionic-native/video-player/ngx';
import {Movie} from '../../models/movie.model';
import {Label} from '../../models/label.model';

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    game: Game;
    similarGames: Game[] = [];

    constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService,
                private _databaseService: DatabaseService, public _authService: AuthService,
                private modalController: ModalController, private photoViewer: PhotoViewer,
                private videoPlayer: VideoPlayer) {
        this.activatedRoute.params.subscribe(params => {
            this._apiService.getGame(params.id).subscribe(game => {
                this.game = _apiService.dataToGame(game);
                for (const platform of game.platforms) {
                    this.game.platforms.push(new Platform(platform.platform.id, platform.platform.name));
                }
                this.getLabels();
                _apiService.getScreenshots(this.game.id).subscribe(screenshots => {
                    if (screenshots) {
                        this.game.screenshots = _apiService.dataToScreenshots(screenshots);
                    }
                });
                _apiService.getMovies(this.game.id).subscribe(movies => {
                    if (movies) {
                        this.game.movies = _apiService.dataToMovies(movies);
                    }
                });
                _apiService.getSimilarGames(this.game.id).subscribe(similarGames => {
                    this.similarGames = [];
                    for (const similarGame of similarGames['results']) {
                        this.similarGames.push(this._apiService.dataToGame(similarGame));
                    }
                });
            }, (error => {
                console.log(error);
                _databaseService.noConnectionAlert();
            }));
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    private getLabels() {
        this._databaseService.getLabels(this.game.id).subscribe(labels => {
            this.game.labels = [];
            if (labels === undefined) {
                console.log('Game not found in database');
                this._databaseService.getAverageLabelsData(this.game);
            } else {
                this.game.dlcDescription = labels['description'];
                this.game.avgCompletion = labels['avgCompletion'];
                if (labels['labels']) {
                    for (const labelData of labels['labels']) {
                        this._databaseService.getLabel(labelData).subscribe(label => {
                            this.game.labels.push(this._databaseService.dataToLabel(label));
                        });
                    }
                } else {
                    this._databaseService.getAverageLabelsData(this.game);
                }
            }
        }, (error => {
            console.log(error);
            this._databaseService.noConnectionAlert();
        }));
    }

    async goToLabelInput() {
        await this._databaseService.presentLoading('Loading labels...');
        const modal = await this.modalController.create({
            component: LabelinputPage,
            componentProps: {
                id: this.game.id,
                title: this.game.title
            }
        });
        modal.onDidDismiss().then(() => this.getLabels());
        return await modal.present();
    }

    goToPlatform(id: number) {
        this._apiService.goToPlatform(id);
    }

    async addToList() {
        const modal = await this.modalController.create({
            component: AddToListPage,
            componentProps: {
                game: this.game
            }
        });
        return await modal.present();
    }

    openScreenshot(screenshot: string, number: number) {
        const options = {
            share: true,
            closeButton: true,
            copyToReference: true,
            headers: ''
        };
        this.photoViewer.show(screenshot, this.game.title + ` - Screenshot #${number + 1}`, options);
    }

    watchMovie(movie: Movie) {
        this.videoPlayer.play(movie.movieUrl, {scalingMode: 2});
    }

    goToGame(id: number) {
        this._apiService.goToGame(id);
    }

    // Shows full description of the game.
    fullDescription() {
        this._databaseService.customAlert(this.game.title, this.game.description);
    }

    // Shows full description of selected label.
    showLabelInfo(label: Label) {
        this._databaseService.customAlert(label.name, label.descriptionLarge);
    }

}
