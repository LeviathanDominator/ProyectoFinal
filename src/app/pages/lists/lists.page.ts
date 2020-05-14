import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {DatabaseService} from "../../services/database.service";
import {List} from "../../models/list.model";
import {Game} from "../../models/game.model";
import {Router} from "@angular/router";

@Component({
    selector: 'app-lists',
    templateUrl: './lists.page.html',
    styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

    lists: List[];

    constructor(private _authService: AuthService, private _databaseService: DatabaseService, private router: Router) {
        this.lists = [];
        _authService.user.subscribe(user => {
            _databaseService.getUser(user.uid).subscribe(userData => {
                _databaseService.getLists(user.uid).subscribe(lists => {
                    console.log(lists[0]);
                    for (let i = 0; i < lists.length; i++) {
                        console.log(lists[i]['games']);
                        const newList = new List();
                        newList.id = String(i);
                        newList.title = "Title";
                        newList.games = lists[i]['games'];
                        /*for (let j = 0; j < lists[i]['games']; j++) {
                            const gameData = lists[i]['games'][j];
                            console.log("GameData", lists[i]['games'][j]);
                            const game = new Game();
                            game.id = gameData['id'];
                            game.title = gameData['name'];
                            list.games.push(game);
                        }*/
                        this.lists.push(newList);
                    }
                });
            })
        });
    }

    ngOnInit() {
    }

    goToList(id: string) {
        console.log(id);
        this.router.navigate(['/list', id]);
    }

}
