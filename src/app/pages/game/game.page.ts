import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Game} from "../../models/game.model";
import {ApiService} from "../../services/api.service";
import {DatabaseService} from "../../services/database.service";
import {SearchPage} from "../search/search.page";
import {ModalController} from "@ionic/angular";
import {LabelinputPage} from "../labelinput/labelinput.page";
import {Label} from "../../models/label.model";

@Component({
    selector: 'app-game',
    templateUrl: './game.page.html',
    styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

    game: Game = new Game();

    constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService,
                private _databaseService: DatabaseService, private modalController: ModalController) {
        this.activatedRoute.params.subscribe(params => {
            this._apiService.getGame(params.id).subscribe(game => {
                console.log(game);
                this.game.title = game.name;
                this.game.id = game.id;
                this.game.image = game.background_image;
                this.game.description = game.description_raw;

                /*_databaseService.getLabels(this.game.id).then((labels:Label[])=>{
                    this.game.labels = labels;
                });*/
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
}
