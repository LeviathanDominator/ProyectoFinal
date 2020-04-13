import {Component, OnInit} from '@angular/core';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {DatabaseService} from "../../services/database.service";
import {ApiService} from "../../services/api.service";
import {ModalController} from "@ionic/angular";
import {SearchPage} from "../search/search.page";
import {Game} from "../../models/game.model";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    private game: Game;
    private barcode = '';

    constructor(private barcodeScanner: BarcodeScanner, private _databaseService: DatabaseService,
                private _apiService: ApiService, private modalController: ModalController) {
    }

    ngOnInit(): void {
    }

    scanGame() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log(barcodeData.text);
            this._databaseService.getBarcodeGame(barcodeData.text).subscribe(data => {
                if (data != null) {
                    // @ts-ignore
                    this._apiService.getGame(data.id).subscribe(game => {
                        console.log(game);
                        this.game = new Game();
                        this.game.title = game.name;
                        if (game.description_raw.length != 0){
                            this.game.description = game.description_raw;
                        } else {
                            this.game.description = game.description;
                        }
                        this.game.rating = game.esrb_rating.name;
                        this.game.image = game.background_image;
                        this.game.release_date = game.released;
                    });
                } else {
                    this.searchModal(barcodeData.text);
                }
            });
            console.log("Barcode Data", barcodeData);
            this.barcode = barcodeData.text;
        }).catch(error => {
            console.log(error);
        });
    }

    async searchModal(barcode: string) {
        const modal = await this.modalController.create({
            component: SearchPage
        });
        modal.onDidDismiss().then(game =>
            this._databaseService.addBarcodeGame(barcode, game.data)
        );
        return await modal.present();
    }

}
