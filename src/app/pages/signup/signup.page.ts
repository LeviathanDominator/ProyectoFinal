import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.page.html',
    styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

    user: User = new User();

    constructor(private _authService: AuthService, private modalController: ModalController) {
    }

    ngOnInit() {
    }

    signup(form: any) {
        const user = new User();
        user.name = form['value'].name;
        user.email = form['value'].email;
        console.log(user);
        this._authService.register(user, form['value'].password);
        this.close()
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
