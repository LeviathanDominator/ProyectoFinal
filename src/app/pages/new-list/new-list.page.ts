/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-new-list',
    templateUrl: './new-list.page.html',
    styleUrls: ['./new-list.page.scss'],
})
export class NewListPage implements OnInit {

    name: string;
    userId: string;

    constructor(private _databaseService: DatabaseService, private _authService: AuthService,
                private modalController: ModalController) {
        this.name = '';
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
        this._databaseService.newList(this.userId, this.name).then(() => this.close());
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
