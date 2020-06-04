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

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    game: Game;

    constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService,
                private _databaseService: DatabaseService, private _authService: AuthService,
                private modalController: ModalController) {
        this.activatedRoute.params.subscribe(params => {
            console.log(params.id);
            this._apiService.getGame(params.id).subscribe(game => {
                this.game = _apiService.dataToGame(game);
                for (const platform of game.platforms) {
                    this.game.platforms.push(new Platform(platform.platform.id, platform.platform.name));
                }
                _databaseService.getLabels(this.game.id).subscribe(labels => {
                    this.game.labels = [];
                    if (labels === undefined) {
                        console.log('Game not found in database');
                        this._databaseService.getAverageLabelsData(this.game);
                    } else {
                        this.game.dlcDescription = labels['description'];
                        this.game.avgCompletion = labels['avgCompletion'];
                        if (labels['labels']) {
                            for (const labelData of labels['labels']) {
                                _databaseService.getLabel(labelData).subscribe(label => {
                                    this.game.labels.push(_databaseService.dataToLabel(label));
                                });
                            }
                        } else {
                            this._databaseService.getAverageLabelsData(this.game);
                        }
                    }
                }, (error => {
                    console.log(error);
                    _databaseService.noConnectionAlert();
                }));
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

    async goToLabelInput() {
        this._databaseService.presentLoading('Loading labels...');
        const modal = await this.modalController.create({
            component: LabelinputPage,
            componentProps: {
                id: this.game.id,
                title: this.game.title
            }
        });
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
}
