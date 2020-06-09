/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'app-new-list',
    templateUrl: './new-list.page.html',
    styleUrls: ['./new-list.page.scss'],
})
export class NewListPage implements OnInit {

    name: string; // List name
    userId: string;
    gameId: number;
    gameTitle: string;

    constructor(private _databaseService: DatabaseService, private _authService: AuthService,
                private modalController: ModalController, private navParams: NavParams) {
        this.name = '';
        if (this.navParams.get('gameId') && this.navParams.get('gameTitle')) {
            this.gameId = this.navParams.get('gameId');
            this.gameTitle = this.navParams.get('gameTitle');
        }
        _authService.user.subscribe(user => {
            this.userId = user.uid;
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    createList() {
        // tslint:disable-next-line:triple-equals
        if (this.name.length == 0) {
            this._databaseService.toast('You must input a name for the list.');
            return;
        }
        this._databaseService.newList(this.userId, this.name, this.gameId).then(() => {
            const listCreated = `List "${this.name}" created`;
            if (this.gameTitle) {
                this._databaseService.toast(`${listCreated}, added "${this.gameTitle}" to the new list`);
            } else {
                this._databaseService.toast(listCreated);
            }
            this.close();
        });
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
