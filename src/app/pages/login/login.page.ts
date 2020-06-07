/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {AuthService} from '../../services/auth.service';
import {AlertController, ModalController} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';
import {StorageService} from '../../services/storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    user: User = new User();
    password: string;

    constructor(private modalController: ModalController, private _authService: AuthService,
                private _databaseService: DatabaseService, private alertController: AlertController,
                private _storageService: StorageService) {
    }

    ngOnInit() {
    }

    // Receives form with user data and tries to grant access to the user.
    login(form: any) {
        this._authService.login(form.value).then(() => this._authService.reloadApp()).catch(r => console.log(r));
    }

    loginGoogle() {
        this._authService.loginGoogle().then(user => {
            console.log(user);
            const newUser = new User(user.uid, user.displayName, user.email);
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

    // Closes modal.
    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
