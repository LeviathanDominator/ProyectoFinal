import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {NewListPage} from '../new-list/new-list.page';
import {ListPage} from '../list/list.page';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.page.html',
    styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

    userId: string;
    lists: List[];

    constructor(private _authService: AuthService, private _databaseService: DatabaseService, private router: Router,
                private modalController: ModalController, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(params => {
            if (params.id == 0) {
                _authService.user.subscribe(user => {
                    if (user) {
                        this.userId = user.uid;
                        this.getLists(user.uid);
                    }
                });
            } else {
                this.getLists(params.id);
            }
        });
    }

    ngOnInit() {
    }

    private getLists(id: string) {
        this._databaseService.getLists(id).subscribe(lists => {
            this.lists = [];
            for (const list of lists) {
                const newList = this._databaseService.dataToList(list);
                console.log(newList);
                this.lists.push(newList);
            }
        });
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
