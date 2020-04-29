import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private user: User = new User();

  constructor(private modalController: ModalController, private _authService: AuthService) { }

  ngOnInit() {
  }

  login(localForm: any) {
    console.log(localForm['value']);
    this._authService.login(localForm['value']);
    this.close()
  }

  close() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
