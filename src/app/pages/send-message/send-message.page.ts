/* tslint:disable:variable-name triple-equals */
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
    title = '';
    message = '';

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
        if (this.title.length == 0 && this.message.length == 0) {
            this._databaseService.toast('Title and message fields cannot be empty');
        } else if (this.title.length == 0) {
            this._databaseService.toast('Title field cannot be empty');
        } else if (this.message.length == 0) {
            this._databaseService.toast('Message field cannot be empty');
        } else {
            this._authService.user.subscribe(sender => {
                this._databaseService.sendMessage(sender.uid, this.user.id, this.title, this.message).then(() => {
                    this._databaseService.toast(`Your message has been sent to ${this.user.name}`);
                    this.close();
                });
            });
        }
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
