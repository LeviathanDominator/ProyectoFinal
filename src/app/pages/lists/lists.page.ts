import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {NewListPage} from '../new-list/new-list.page';
import {ListPage} from "../list/list.page";

@Component({
    selector: 'app-lists',
    templateUrl: './lists.page.html',
    styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

    userId: string;
    lists: List[];

    // TODO Get user passed by parameter, not the actual user

    constructor(private _authService: AuthService, private _databaseService: DatabaseService, private router: Router,
                private modalController: ModalController) {
        _authService.user.subscribe(user => {
            if (user) {
                this.userId = user.uid;
                console.log('User', user);
                _databaseService.getLists(user.uid).subscribe(lists => {
                    this.lists = [];
                    for (const list of lists) {
                        const newList = this._databaseService.dataToList(list);
                        console.log(newList);
                        this.lists.push(newList);
                    }
                });
            }
        });
    }

    ngOnInit() {
    }

    async goToList(id: string) {
        const modal = await this.modalController.create({
            component: ListPage,
            componentProps: {
                userId: this.userId,
                listId: id
            }
        });
        return await modal.present();
    }

    async addList() {
        const modal = await this.modalController.create({
            component: NewListPage
        });
        return await modal.present();
    }
}
