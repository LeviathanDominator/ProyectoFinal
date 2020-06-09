/* tslint:disable:no-string-literal variable-name */
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';
import {Game} from '../../models/game.model';
import {ApiService} from '../../services/api.service';
import {AlertController, ModalController, NavParams} from '@ionic/angular';

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
    moveItem = true;

    constructor(private navParams: NavParams, public _authService: AuthService, private _databaseService: DatabaseService,
                private _apiService: ApiService, private modalController: ModalController,
                private alertController: AlertController) {
        this.userId = this.navParams.get('userId');
        this._authService.user.subscribe(user => {
            if (user) {
                this.edit = user['uid'] === this.userId;
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
        this._databaseService.getList(this.navParams.get('listId'), this.userId).subscribe(list => {
            if (list) {
                this.list = this._databaseService.dataToList(list);
                console.log(this.list.games);
                this.getGames();
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
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

    // User can order items freely. This method reorders the items and then they are reuploaded to the database.
    // It also prevents the user from updating the list while it is already updating to prevent errors.
    reorderItems(event: CustomEvent) {
        this.moveItem = false;
        const itemMove = this.games.splice(event.detail.from, 1)[0];
        this.games.splice(event.detail.to, 0, itemMove);
        this._databaseService.updateList(this.userId, this.list, this.games);
        event.detail.complete();
        this.moveItem = true;
    }

    // Goes to the specific game.
    goToGame(game: Game) {
        this._apiService.goToGame(game.id);
        this.close();
    }

    // Deletes a game from the list.
    deleteGame(id: number) {
        const games = [];
        for (const game of this.games) {
            if (game.id !== id) {
                games.push(game);
            }
        }
        this._databaseService.updateList(this.userId, this.list, games);
    }

    // Shows a prompt to the user. If accepted, the list will be deleted.
   async deleteList(list: List) {
        const alert = await this.alertController.create({
            header: `Are you sure you want to delete list "${list.name}"? This action cannot be reversed.`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Delete',
                    handler: () => {
                        this._databaseService.deleteList(this.userId, list);
                        this.close();
                    }
                }
            ]
        });
        await alert.present();
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

// Allows user to edit the name of the selected list.
    async editList(list: List) {
        const alert = await this.alertController.create({
            header: 'Setting a new name for your list',
            inputs: [
                {
                    name: 'listname',
                    placeholder: 'List name',
                    value: list.name
                }
            ],
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Change',
                    handler: data => {
                        const name: string = data['listname'];
                        // tslint:disable-next-line:triple-equals
                        if (name.length == 0) {
                            this._databaseService.toast('Couldn\'t change name. ' +
                                'The input for the name of the list cannot be empty.');
                        } else {
                            list.name = name;
                            this._databaseService.updateList(this.userId, list);
                            this._databaseService.toast(`List name changed to \"${list.name}\" successfully.`);
                        }
                    }
                }
            ]
        });
        await alert.present();
    }
}
