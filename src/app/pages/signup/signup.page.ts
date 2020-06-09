import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    user: User = new User();
    password = '';

    // tslint:disable-next-line:variable-name
    constructor(private _authService: AuthService, public _databaseService: DatabaseService,
                private modalController: ModalController) {
    }

    ngOnInit() {
    }

    signup(form: any) {
        if (form.invalid) {
            this._databaseService.toast('All fields are required.');
            return;
        } else if (this.user.name.length > this._databaseService.nameLength) {
            this._databaseService.toast('Your name is too long.');
            return;
        }
        const user = new User();
        user.name = form.value.name;
        user.email = form.value.email;
        user.signUpDate = new Date();
        this._authService.register(user, form.value.password).then(data => {
            user.id = data.user.uid;
            this._databaseService.addUserToDatabase(user).then(() => {
                this.close();
                this._authService.reloadApp();
            });
        });
    }

    loginGoogle() {
        this._authService.loginGoogle().then(user => {
            const newUser = new User(user.uid, user.displayName, user.email);
            newUser.signUpDate = new Date();
            this._databaseService.getUser(newUser.id).subscribe(userData => {
                if (!userData) {
                    this._databaseService.addUserToDatabase(newUser).then(() => {
                        this.close();
                    });
                } else {
                    this.close();
                }
            });
        });
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
