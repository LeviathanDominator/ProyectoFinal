import {Component, OnInit} from '@angular/core';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {DatabaseService} from "../../services/database.service";
import {ApiService} from "../../services/api.service";
import {ModalController} from "@ionic/angular";
import {SearchPage} from "../search/search.page";
import {Game} from "../../models/game.model";
import {log} from "util";
import {Platform} from "../../models/platform.model";
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    private games: Game[] = [];
    private platforms: Platform[] = [];
    private selectedPlatform: number = 0;
    private selected: number;

    constructor(private barcodeScanner: BarcodeScanner, private _databaseService: DatabaseService,
                private _apiService: ApiService, private _authService: AuthService, private modalController: ModalController) {
        this.getGames();
        _apiService.getPlatforms(1).subscribe(platforms => {
            for (let platformResult of platforms["results"]) {
                const platform = new Platform();
                platform.id = platformResult.id;
                platform.name = platformResult.name;
                this.platforms.push(platform);
            }
        })
        _apiService.getDevelopers(1).subscribe(developers => {
            //console.log(developers['results']);
        })
        console.log("User", _authService.user());
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
            //this.barcode = barcodeData.text;
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

    private getGames() {
        this.games = [];
        if (this.selectedPlatform == 0) {
            this._apiService.getGames().subscribe(games => {
                this.setGames(games.results);

            })
        } else {
            this._apiService.getGamesByPlatform(this.selectedPlatform, 1).subscribe(games => {
                this.setGames(games.results);
            })
        }
    }

    private setGames(results: any) {
        for (let gameResult of results) {
            const game = new Game();
            game.id = gameResult.id;
            game.title = gameResult.name;
            game.image = gameResult.background_image;
            game.screenshots = gameResult.short_screenshots;
            game.labels = this._databaseService.getLabels(game.id)
            this.games.push(game);
        }
    }
}
