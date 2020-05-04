import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import * as firebase from "firebase";
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User = new User();

  constructor(private _authService: AuthService, private _databaseService: DatabaseService) {
    _authService.user.subscribe(user => {
      this._databaseService.getUser(user['uid']).subscribe(user => {
        this.user.id = user['id'];
        this.user.name = user['name'];
      });
    });
  }

  ngOnInit() {
  }

}
