import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {DatabaseService} from "../../services/database.service";
import {List} from "../../models/list.model";
import {Game} from "../../models/game.model";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  list: List;
  games: Game[];

  constructor(private _authService: AuthService, private _databaseService: DatabaseService, private _apiService: ApiService, private activatedRoute: ActivatedRoute) {
    this.list = new List();
    _authService.user.subscribe(user => {
    this.activatedRoute.params.subscribe(params => {
      console.log(params['id'], user.uid);
      _databaseService.getList(params['id'], user.uid).subscribe(list => {
        this.list.title = list['title'];
        this.games = [];
        console.log(list);
        for (let i = 0; i < list['games'].length; i++){
          console.log(list['games'][i]);
          _apiService.getGame(list['games'][i]).subscribe(gameData => {
            let game = new Game();
            game.id = gameData['id'];
            game.title = gameData['name'];
            console.log(game);
            this.games.push(game);
          });
        }
      })
    });});
  }

  ngOnInit() {
  }
}
