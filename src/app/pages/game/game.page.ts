import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Game} from "../../models/game.model";
import {ApiService} from "../../services/api.service";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  private game: Game = new Game();

  constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService,
              private _databaseService: DatabaseService) {
    this.activatedRoute.params.subscribe(params => {
      this._apiService.getGame(params.id).subscribe(game =>{
        console.log(game);
        this.game.title = game.name;
        this.game.id = game.id;
        this.game.image = game.background_image;
        this.game.description = game.description_raw;
        this.game.labels = _databaseService.getLabels(this.game.id);
      })
    })
  }

  ngOnInit() {
  }

}
