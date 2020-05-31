import {Component} from '@angular/core';

import {ModalController, NavController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LoginPage} from './pages/login/login.page';
import {AuthService} from './services/auth.service';
import {SignupPage} from './pages/signup/signup.page';
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private modalController: ModalController,
        public _authService: AuthService,
        private navController: NavController,
        private router: Router,
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
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
        console.log(this._authService.currentUser);
        const modal = await this.modalController.create({
            component: SignupPage
        });
        return await modal.present().then(() => {
            // Refresh the page after sign up.
            this.router.navigateByUrl('/home');
        });
    }

    logout() {
        this.router.navigateByUrl('home');
        this._authService.logout();
    }
}
