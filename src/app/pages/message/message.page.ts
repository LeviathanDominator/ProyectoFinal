/* tslint:disable:variable-name no-string-literal */
import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {Message} from '../../models/message.model';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-message',
    templateUrl: './message.page.html',
    styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

    message: Message;
    senderEmail: string;
    senderAvatar: string;

    constructor(private navParams: NavParams, private modalController: ModalController,
                private _databaseService: DatabaseService, private _authService: AuthService,
                private _storageService: StorageService) {
        this.message = this.navParams.get('message');
        this._databaseService.getUser(this.message.sender).subscribe(sender => {
            if (sender) {
                this.message.senderName = sender['name'];
                this.senderEmail = sender['email'];
            } else {
                this.message.senderName = 'Unknown';
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
        this._storageService.getAvatar(this.message.sender).then(url => {
            this.senderAvatar = url;
        }).catch(() => this.senderAvatar = 'assets/img/default_avatar.jpg');
        _databaseService.markMessageAsRead(this.message);
        console.log(this.message);
    }

    ngOnInit() {
    }

    deleteMessage() {
        this._databaseService.deleteMessage(this.message);
        this.modalController.dismiss();
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

    goToUser() {
        this.close();
        this._databaseService.goToUser(this.message.sender);
    }
}
