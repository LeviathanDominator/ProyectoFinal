/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'app-send-message',
    templateUrl: './send-message.page.html',
    styleUrls: ['./send-message.page.scss'],
})
export class SendMessagePage implements OnInit {

    user: User;
    message: string;

    constructor(private navParams: NavParams, private modalController: ModalController,
                private _databaseService: DatabaseService, private _authService: AuthService) {
        this._databaseService.getUser(this.navParams.get('id')).subscribe(user => {
            this.user = this._databaseService.dataToUser(user);
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    sendMessage() {
        this._authService.user.subscribe(sender => {
            this._databaseService.sendMessage(sender.uid, this.user.id, this.message).then(() => this.close());
        });
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
