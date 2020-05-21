import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.page.html',
  styleUrls: ['./new-list.page.scss'],
})
export class NewListPage implements OnInit {

  name: string;
  id: number;
  lists: string[];

  constructor( private _databaseService: DatabaseService, private _authService: AuthService) {
    this.name = "";
    // TODO Dont take current user. Take user got by the url parameter.
    _authService.user.subscribe(user => {
      _databaseService.getLists(user['uid']).subscribe(lists => {
        this.lists = [];
        console.log(lists);
        for (let list of lists){
          console.log(list);
        }
        this.id = lists.length;
        // TODO New list for this user but with an auto generated id.
       // _databaseService.newList(user['uid'], this.id, this.name);
      });
    });
  }

  ngOnInit() {
  }

  createList(form: any) {
    console.log(form['value']['text']);
  }
}
