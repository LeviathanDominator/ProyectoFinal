import { Component, OnInit } from '@angular/core';
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

  constructor(private modalController: ModalController, private _authService: AuthService) { }

  ngOnInit() {
  }

  login(form: any) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    this._authService.login(form.value).then(() => this.close()).catch(r => console.log(r));
  }

  close() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
