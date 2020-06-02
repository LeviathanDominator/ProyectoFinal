/* tslint:disable:variable-name */
import {Component} from '@angular/core';

import {ModalController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LoginPage} from './pages/login/login.page';
import {AuthService} from './services/auth.service';
import {SignupPage} from './pages/signup/signup.page';
import {Router} from '@angular/router';
import {DatabaseService} from './services/database.service';
import {User} from './models/user.model';
import {StorageService} from './services/storage.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    private user: User;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private modalController: ModalController,
        public _authService: AuthService,
        private _storageService: StorageService,
        private _databaseService: DatabaseService,
        private navController: NavController,
        private router: Router,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.loadUser();
        });
    }

    private loadUser() {
        this._authService.user.subscribe(params => {
            if (params !== null) {
                // @ts-ignore
                this._databaseService.getUser(params.uid).subscribe(user => {
                    if (user) {
                        this.user = this._databaseService.dataToUser(user);
                        this._storageService.getAvatar(this.user.id).then(url => {
                            this.user.avatar = url;
                        }).catch(() => console.log('No avatar.'));
                    }
                });
            }
        });
    }

    async goToLogin() {
        console.log(this._authService.currentUser);
        const modal = await this.modalController.create({
            component: LoginPage
        });
        return await modal.present().then(() => {
            // Refresh the page after login.
            this.router.navigateByUrl('/home');
        });
    }

    async goToSignUp() {
        const modal = await this.modalController.create({
            component: SignupPage
        });
        return await modal.present().then(() => {
            // Refresh the page after sign up.
            this.router.navigateByUrl('/home');
        });
    }

    logout() {
        this._authService.logout();
    }
}
