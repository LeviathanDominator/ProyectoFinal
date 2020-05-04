import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[] = [];

  constructor(private _databaseService: DatabaseService) {
    _databaseService.getUsers().subscribe(newUsers => {
      console.log(newUsers[0]['id']);
      for (let i = 0; i < newUsers.length; i++) {
        let user: User = new User();
        user.id = newUsers[i]['id'];
        user.name = newUsers[i]['name'];
        this.users.push(user);
      }
    })
  }

  ngOnInit() {
  }

  goToUser(id: string) {
      this._databaseService.goToUser(id);
  }
}
