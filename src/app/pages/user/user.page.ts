import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";
import {List} from "../../models/list.model";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {

  user: User = new User();
  lists: List[];

  constructor(private activatedRoute: ActivatedRoute, private _databaseService: DatabaseService) {
    this.activatedRoute.params.subscribe(params => {
      this._databaseService.getUser(params['id']).subscribe(user => {
        console.log(user);
        this.user.id = user['id'];
        this.user.name = user['name'];
      });
      this._databaseService.getLists(params['id']).subscribe(lists => {
        this.lists = [];
        for (let list of lists){
          console.log(list);
          const newList = new List();
          newList.title = list['title'];
          newList.games = list['games'];
          console.log(newList);
          this.lists.push(newList);
        }
      });
    });
  }

  ngOnInit() {
  }

}
