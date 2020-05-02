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

    private user: User = new User();

    constructor(private _authService: AuthService, private modalController: ModalController) {
    }

    ngOnInit() {
    }

    signup(form: any) {
        console.log(form['value']);
        this._authService.register(form['value']);
        this.close()
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
