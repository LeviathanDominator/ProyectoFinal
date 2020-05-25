import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';
import {Game} from '../../models/game.model';
import {ApiService} from '../../services/api.service';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'app-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

    userId = '';
    list: List;
    games: Game[];
    edit = false;

    constructor(private navParams: NavParams, private _authService: AuthService, private _databaseService: DatabaseService,
                private _apiService: ApiService, private modalController: ModalController) {
        this.userId = this.navParams.get('userId');
        this._authService.user.subscribe(user => {
            this.edit = user['uid'] == this.userId;
        });
        this._databaseService.getList(this.navParams.get('listId'), this.userId).subscribe(list => {
            if (list) {
                this.list = this._databaseService.dataToList(list);
                console.log(this.list.games);
                this.getGames();
            }
        });
    }

    ngOnInit() {
    }

    private getGames() {
        console.log(this.list.games.length);
        this.games = new Array<Game>(this.list.games.length);
        for (let i = 0; i < this.list.games.length; i++) {
            // We need to initialize every game or else an error would be thrown.
            this.games[i] = new Game(0, '');
            this._apiService.getGame(this.list.games[i]).subscribe(game => {
                if (game) {
                    this.games[i] = this._apiService.dataToGame(game);
                }
            });
        }
    }

    reorderItems(event: CustomEvent) {
        const itemMove = this.games.splice(event.detail.from, 1)[0];
        this.games.splice(event.detail.to, 0, itemMove);
        this._databaseService.updateList(this.userId, this.list, this.games);
        event.detail.complete();
    }

    goToGame(game: Game) {
        this._apiService.goToGame(game.id);
        this.close();
    }

    deleteGame(id: number) {
        const games = [];
        for (const game of this.games) {
            if (game.id !== id) {
                games.push(game);
            }
        }
        this._databaseService.updateList(this.userId, this.list, games);
    }

    deleteList(list: List) {
        this._databaseService.deleteList(this.userId, list);
        this.close();
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

// TODO Edit list
    editList(list: List) {

    }
}
