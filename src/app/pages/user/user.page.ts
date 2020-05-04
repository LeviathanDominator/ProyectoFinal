import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user: User = new User();

  constructor(private activatedRoute: ActivatedRoute, private _databaseService: DatabaseService) {
    this.activatedRoute.params.subscribe(params => {
      this._databaseService.getUser(params['id']).subscribe(user => {
        console.log(user);
        this.user.id = user['id'];
        this.user.name = user['name'];
      });
    });
  }

  ngOnInit() {
  }

}
