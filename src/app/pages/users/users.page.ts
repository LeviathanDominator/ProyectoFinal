import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[];

  constructor(private _databaseService: DatabaseService) {
    _databaseService.getUsers().subscribe(users => {
      this.users = [];
      for (let user of users) {
        this.users.push(new User(user['id'], user['name']));
      }
    })
  }

  ngOnInit() {
  }

  goToUser(id: string) {
      this._databaseService.goToUser(id);
  }
}
