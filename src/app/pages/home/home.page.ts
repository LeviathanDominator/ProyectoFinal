import {Component, OnInit} from '@angular/core';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {DatabaseService} from "../../services/database.service";
import {ApiService} from "../../services/api.service";
import {ModalController} from "@ionic/angular";
import {SearchPage} from "../search/search.page";
import {Game} from "../../models/game.model";
import {log} from "util";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    private games: Game[] = [];
    private selected: number;
    private barcode = '';

    constructor(private barcodeScanner: BarcodeScanner, private _databaseService: DatabaseService,
                private _apiService: ApiService, private modalController: ModalController) {
        _apiService.getGames().subscribe(games => {
            console.log(games.results);
            for (let gameResult of games.results){
                //console.log(gameResult);
                const game = new Game();
                game.id = gameResult.id;
                game.title = gameResult.name;
                game.image = gameResult.background_image;
                game.labels = _databaseService.getLabels(game.id)
                this.games.push(game);
            }
        })
        _apiService.getGenres(1).subscribe(genres => {
            //console.log(genres['results']);
        })
        _apiService.getDevelopers(1).subscribe(developers => {
            //console.log(developers['results']);
        })
    }

    ngOnInit(): void {
    }

    scanGame() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log(barcodeData.text);
            this._databaseService.getBarcodeGame(barcodeData.text).subscribe(data => {
                if (data != null) {
                    this.goToGame(data["id"]);
                } else {
                   // this.searchModal(barcodeData.text);
                }
            });
            console.log("Barcode Data", barcodeData);
            this.barcode = barcodeData.text;
        }).catch(error => {
            console.log(error);
        });
    }

    selectGame(id: number) {
        this.selected = id != this.selected ? id : undefined;
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

    async searchModal() {
        const modal = await this.modalController.create({
            component: SearchPage
        });
        return await modal.present();
    }

}
