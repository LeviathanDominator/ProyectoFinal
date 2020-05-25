import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {User} from '../../models/user.model';
import {List} from '../../models/list.model';
import {SendMessagePage} from '../send-message/send-message.page';
import {ModalController} from '@ionic/angular';
import {ListPage} from '../list/list.page';

@Component({
    selector: 'app-user',
    templateUrl: './user.page.html',
    styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

    user: User;
    lists: List[];

    constructor(private activatedRoute: ActivatedRoute, private _databaseService: DatabaseService,
                private modalController: ModalController) {
        this.activatedRoute.params.subscribe(params => {
            this._databaseService.getUser(params.id).subscribe(user => {
                if (user) {
                    this.user = new User(user["id"], user["name"]);
                }
            });
            this._databaseService.getLists(params.id).subscribe(lists => {
                this.lists = [];
                for (const list of lists) {
                    this.lists.push(this._databaseService.dataToList(list));
                }
            });
        });
    }

    ngOnInit() {
    }

    async sendMessage(id: string) {
        const modal = await this.modalController.create({
            component: SendMessagePage,
            componentProps: {id}
        });
        return await modal.present();
    }

    async goToList(id: string) {
        const modal = await this.modalController.create({
            component: ListPage,
            componentProps: {
                userId: this.user.id,
                listId: id
            }
        });
        return await modal.present();
    }
}
