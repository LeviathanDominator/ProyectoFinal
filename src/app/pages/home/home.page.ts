import {Component, OnInit, ViewChild} from '@angular/core';
import {BarcodeScanner} from "@ionic-native/barcode-scanner/ngx";
import {DatabaseService} from "../../services/database.service";
import {ApiService} from "../../services/api.service";
import {IonInfiniteScroll, ModalController} from "@ionic/angular";
import {SearchPage} from "../search/search.page";
import {Game} from "../../models/game.model";
import {Platform} from "../../models/platform.model";
import {AuthService} from "../../services/auth.service";
import {Label} from "../../models/label.model";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(){

    }
    ngOnInit(): void {
    }


}
