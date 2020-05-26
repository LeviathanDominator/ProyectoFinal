/* tslint:disable:no-string-literal variable-name */
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {Observable, Subscriber} from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    unreadMessages: boolean;

    constructor(private _databaseService: DatabaseService, private _authService: AuthService) {
        this.unreadMessages = false;
        _authService.user.subscribe(user => {
            if (user) {
                _databaseService.getMessages(user['uid']).subscribe(messages => {
                    console.log(messages);
                    this.unreadMessages = this.readMessages(messages);
                });
            }
        });
    }

    private readMessages(messages: any) {
        for (const message of messages) {
            if (!message['read']) {
                return true;
            }
        }
        return false;
    }

    ngOnInit(): void {
    }


    isAdmin(): Observable<boolean> {
        return new Observable<boolean>((subscriber: Subscriber<boolean>) => {
            this._authService.user.subscribe(user => {
                this._databaseService.getAdmins().subscribe(admins => {
                    subscriber.next(false);
                    if (user) {
                        for (const admin of admins) {
                            console.log(admin['id'], user['uid']);
                            if (admin['id'] === user['uid']) {
                                subscriber.next(true);
                            }
                        }
                    }
                    return subscriber.complete();
                });
            });
        });
    }
}
