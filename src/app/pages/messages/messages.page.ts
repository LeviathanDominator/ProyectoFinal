/* tslint:disable:variable-name no-string-literal */
import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {Message} from '../../models/message.model';
import {AlertController, ModalController} from '@ionic/angular';
import {MessagePage} from '../message/message.page';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.page.html',
    styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

    messages: Message[] = [];
    numUnreadMessages = 0;

    constructor(private _authService: AuthService, private _databaseService: DatabaseService,
                private modalController: ModalController, private alertController: AlertController) {
        this._authService.user.subscribe(user => {
            if (user) {
                this._databaseService.getMessages(user.uid).subscribe(messages => {
                    this.messages = [];
                    this.numUnreadMessages = 0;
                    for (const message of messages) {
                        const newMessage = _databaseService.dataToMessage(message);
                        if (!newMessage.read) {
                            this.numUnreadMessages++;
                        }
                        this._databaseService.getUser(newMessage.sender).subscribe(sender => {
                            if (sender) {
                                newMessage.senderName = sender['name'];
                            } else {
                                newMessage.senderName = 'Unknown';
                            }
                            this.pushAndSort(newMessage);
                        });
                    }
                }, (error => {
                    console.log(error);
                    _databaseService.noConnectionAlert();
                }));
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    async openMessage(message: Message) {
        const modal = await this.modalController.create({
            component: MessagePage,
            componentProps: {message}
        });
        return await modal.present();
    }

    private pushAndSort(message: Message) {
        this.messages.push(message);
        this.messages.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            }
            if (a.date > b.date) {
                return -1;
            }
            return 0;
        });
    }


    async deleteAllMessages() {
        const alert = await this.alertController.create({
            header: `Are you sure you want to delete all messages? This action cannot be reversed.`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        // tslint:disable-next-line:triple-equals
                        if (this.messages.length == 0) {
                            this._databaseService.toast('No messages to be deleted.');
                        } else {
                            for (const message of this.messages) {
                                this._databaseService.deleteMessage(message).then(() => {
                                    this._databaseService.toast('All your messages have been deleted.');
                                    this.messages = [];
                                });
                            }
                        }
                    }
                }
            ]
        });
        await alert.present();
    }
}
