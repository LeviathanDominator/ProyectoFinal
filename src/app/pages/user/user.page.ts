import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DatabaseService} from '../../services/database.service';
import {User} from '../../models/user.model';
import {List} from '../../models/list.model';
import {LoginPage} from '../login/login.page';
import {SendMessagePage} from '../send-message/send-message.page';
import {ModalController} from '@ionic/angular';

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
                    console.log(list);
                    const newList = new List();
                    newList.title = list.title;
                    newList.games = list.games;
                    console.log(newList);
                    this.lists.push(newList);
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
}
