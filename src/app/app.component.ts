import {Component} from '@angular/core';

import {ModalController, Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {LoginPage} from "./pages/login/login.page";
import {AuthService} from "./services/auth.service";

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
        private _authService: AuthService,
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
        return await modal.present();
    }

    logout() {
        this._authService.getUser().subscribe(user => {
            console.log(user);
        });
        //this._authService.logout();
    }
}
