import {Component, OnInit} from '@angular/core';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {DatabaseService} from "../../services/database.service";
import {ApiService} from "../../services/api.service";
import {ModalController} from "@ionic/angular";
import {SearchPage} from "../search/search.page";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    private game: any = [];
    private text = '';
    private format = '';
    private cancelled = false;

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
                        this.game = game;
                    });

                    console.log("Data");
                } else {
                    console.log("No data");
                    this.searchModal(barcodeData.text);
                }
                console.log(data);
            });
            this.text = barcodeData.text;
            this.format = barcodeData.format;
            this.cancelled = barcodeData.cancelled;
            console.log(this.text);
        }).catch(error => {
            console.log(error);
        });
    }

    async searchModal(barcode: string) {
        const modal = await this.modalController.create({
            component: SearchPage
        });
        modal.onDidDismiss().then(game => this._databaseService.addBarcodeGame(barcode, game.data));
        return await modal.present();
    }

}
