import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Game} from '../../models/game.model';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';

@Component({
  selector: 'app-add-to-list',
  templateUrl: './add-to-list.page.html',
  styleUrls: ['./add-to-list.page.scss'],
})
export class AddToListPage implements OnInit {

  game: Game;
  lists: List[];

  constructor(private navParams: NavParams, private _authService: AuthService, private _databaseService: DatabaseService,
              private modalController: ModalController) {
    this.game = this.navParams.get('game');
    this._authService.user.subscribe(user => {
      this._databaseService.getLists(user.uid).subscribe(lists => {
        this.lists = [];
        for (const list of lists) {
          this.lists.push(this._databaseService.dataToList(list));
        }
      });
    });
  }

  ngOnInit() {
  }

  addGameToList(list: List) {
    console.log(list);
    if (!this.checkIfExists(list.games)) {
      this._databaseService.addGameToList(list, this.game);
      this.close();
    }
  }

  private checkIfExists(gamesId: number[]) {
    for (const game of gamesId) {
      console.log(game, this.game.id);
      if (game === this.game.id) {
        this._databaseService.toast(' already exists in this list. Please select another.', this.game.title);
        return true;
      }
    }
    return false;
  }

  close() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
