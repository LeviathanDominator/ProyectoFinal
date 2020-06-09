/* tslint:disable:no-string-literal variable-name */
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {Observable, Subscriber} from 'rxjs';
import {User} from '../../models/user.model';
import {SignupPage} from '../signup/signup.page';
import {Router} from '@angular/router';
import {ModalController, Platform} from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    numUnreadMessages = 0;
    user: User;

    constructor(private _databaseService: DatabaseService, public _authService: AuthService,
                private router: Router, private modalController: ModalController, private platform: Platform) {
        _authService.user.subscribe(user => {
            if (user) {
                _databaseService.getMessages(user['uid']).subscribe(messages => {
                    this.numUnreadMessages = this._databaseService.numUnreadMessages(messages);
                }, (() => {
                    _databaseService.noConnectionAlert();
                }));
                _databaseService.getUser(user['uid']).subscribe(userData => {
                    if (userData) {
                        this.user = this._databaseService.dataToUser(userData);
                    }
                }, (() => {
                    _databaseService.noConnectionAlert();
                }));
            }
        }, (() => {
            _databaseService.noConnectionAlert();
        }));
        // This allows the user to exit the app when in homepage.
        this.platform.backButton.subscribe(() => {
            console.log(this.router.url);
            if (this.router.url === '/home') {
                navigator['app'].exitApp();
            }
        });
    }

    ngOnInit(): void {
    }

    async goToSignUp() {
        console.log(this._authService.currentUser);
        const modal = await this.modalController.create({
            component: SignupPage
        });
        return await modal.present().then(() => {
            // Refresh the page after sign up.
            this.router.navigateByUrl('/home');
        });
    }
}
