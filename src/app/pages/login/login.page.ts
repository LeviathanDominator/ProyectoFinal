/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    user: User = new User();
    password: string;

    constructor(private modalController: ModalController, private _authService: AuthService) {
    }

    ngOnInit() {
    }

    // Receives form with user data and tries to grant access to the user.
    login(form: any) {
        this._authService.login(form.value).then(() => this._authService.reloadApp()).catch(r => console.log(r));
    }

    // Closes modal.
    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
