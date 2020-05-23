import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';
import {DatabaseService} from "../../services/database.service";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    user: User = new User();
    password = '';

    constructor(private _authService: AuthService, private _databaseService: DatabaseService,
                private modalController: ModalController) {
    }

    ngOnInit() {
    }

    signup(form: any) {
        if (form.invalid) {
            return;
        }
        const user = new User();
        user.name = form.value.name;
        user.email = form.value.email;
        user.signUpDate = this._databaseService.currentDate(false);
        this._authService.register(user, form.value.password).then(() => this.close());
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
