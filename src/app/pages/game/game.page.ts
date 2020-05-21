import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Game} from "../../models/game.model";
import {ApiService} from "../../services/api.service";
import {DatabaseService} from "../../services/database.service";
import {SearchPage} from "../search/search.page";
import {ModalController} from "@ionic/angular";
import {LabelinputPage} from "../labelinput/labelinput.page";
import {Platform} from "../../models/platform.model";

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    game: Game;

    constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService,
                private _databaseService: DatabaseService, private modalController: ModalController) {
        this.activatedRoute.params.subscribe(params => {
            this._apiService.getGame(params.id).subscribe(game => {
                this.game = _apiService.dataToGame(game);
                for (let platform of game['platforms']){
                    this.game.platforms.push(new Platform(platform['platform']['id'], platform['platform']['name']));
                }

                _databaseService.getLabels(this.game.id).subscribe(labels => {
                    this.game.labels = [];
                    if (labels == undefined) {
                        console.log("Game not found in database");
                        //_databaseService.addGame(this.game.id);
                    } else {
                        this.game.dlc_description = labels['description'];
                        for (let labelData of labels['labels']) {
                            _databaseService.getLabel(labelData).subscribe(label => {
                                console.log(label);
                                this.game.labels.push(_databaseService.dataToLabel(label));
                            });
                        }
                    }
                    console.log("Labels: ", labels);
                });
            })
        })
    }

    ngOnInit() {
    }

    async goToLabelInput() {
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

    shareViaTwitter() {

    }
}
