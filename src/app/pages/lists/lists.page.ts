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
    isUser = false; // Checks if user is logged in and allows to add new lists.

    constructor(private _authService: AuthService, private _databaseService: DatabaseService, private router: Router,
                private modalController: ModalController, private activatedRoute: ActivatedRoute) {
        this.activatedRoute.params.subscribe(params => {
            // tslint:disable-next-line:triple-equals
            if (params.id == 0) {
                this.isUser = true;
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
                _authService.user.subscribe(user => {
                    if (user) {
                        // tslint:disable-next-line:triple-equals
                        this.isUser = params.id == user.uid;
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
                this.pushAndSort(newList);
            }
        });
    }

    // Push new list and sorts lists by name.
    private pushAndSort(list: List) {
        this.lists.push(list);
        this.lists.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
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

    async addList() {
        const modal = await this.modalController.create({
            component: NewListPage
        });
        return await modal.present();
    }
}
