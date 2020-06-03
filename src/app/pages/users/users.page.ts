/* tslint:disable:no-string-literal */
import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {User} from '../../models/user.model';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

    users: User[] = [];

    // tslint:disable-next-line:variable-name
    constructor(private _databaseService: DatabaseService, private _storageService: StorageService) {
        _databaseService.getUsers().subscribe(users => {
            this.users = [];
            for (const user of users) {
                const newUser = this._databaseService.dataToUser(user);
                this._storageService.getAvatar(newUser.id).then(url => {
                    if (url) {
                        newUser.avatar = url;
                    }
                }).catch(() => console.log('User ' + newUser.id + 'has no avatar.'));
                this.pushAndSort(newUser);
            }
        }, (() => {
            _databaseService.noConnectionAlert();
        }));
    }

    loadMoreUsers(event) {
            setTimeout(() => {
                event.target.complete();
            }, 500);
    }

    // Sorts user by their name.
    private pushAndSort(user: User) {
        this.users.push(user);
        this.users.sort((a, b) => {
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
                return 1;
            }
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
                return -1;
            }
            return 0;
        });
    }

    ngOnInit() {
    }

    goToUser(id: string) {
        this._databaseService.goToUser(id);
    }
}
