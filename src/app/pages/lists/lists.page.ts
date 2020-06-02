/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {NewListPage} from '../new-list/new-list.page';
import {ListPage} from '../list/list.page';
import {User} from '../../models/user.model';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.page.html',
    styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

    user: User;
    lists: List[];

    constructor(private _authService: AuthService, private _databaseService: DatabaseService, private router: Router,
                private modalController: ModalController, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(params => {
            // tslint:disable-next-line:triple-equals
            if (params.id == 0) {
                _authService.user.subscribe(user => {
                    if (user) {
                        this.getUser(user.uid);
                    }
                }, (error => {
                    console.log(error);
                    _databaseService.noConnectionAlert();
                }));
            } else {
                this.getUser(params.id);
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    private getUser(id: string) {
        this._databaseService.getUser(id).subscribe(user => {
            this.user = this._databaseService.dataToUser(user);
            this.getLists(this.user.id);
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
        console.log(id);
        const modal = await this.modalController.create({
            component: ListPage,
            componentProps: {
                userId: this.user.id,
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
