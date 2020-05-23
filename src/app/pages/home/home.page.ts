import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Game} from '../../models/game.model';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from "../../services/database.service";

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


}
