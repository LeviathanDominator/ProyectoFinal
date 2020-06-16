import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Game} from '../../models/game.model';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {List} from '../../models/list.model';
import {NewListPage} from '../new-list/new-list.page';

@Component({
    selector: 'app-add-to-list',
    templateUrl: './add-to-list.page.html',
    styleUrls: ['./add-to-list.page.scss'],
})
export class AddToListPage implements OnInit {

    game: Game;
    lists: List[];

    // tslint:disable-next-line:variable-name
    constructor(private navParams: NavParams, private _authService: AuthService, private _databaseService: DatabaseService,
                private modalController: ModalController) {
        this.game = this.navParams.get('game');
        this._authService.user.subscribe(user => {
            this._databaseService.getLists(user.uid).subscribe(lists => {
                this.lists = [];
                for (const list of lists) {
                    this.pushAndSort(this._databaseService.dataToList(list));
                }
            }, (() => {
                _databaseService.noConnectionAlert();
            }));
        }, (() => {
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    // Push new list and sorts lists by name.
    private pushAndSort(list: List) {
        this.lists.push(list);
        this.lists.sort((a, b) => {
            if (a.name > b.name) {
                return 1;
            }
            if (a.name < b.name) {
                return -1;
            }
            return 0;
        });
    }

    addGameToList(list: List) {
        if (!this.checkIfExists(list.games)) {
            this._databaseService.addGameToList(list, this.game);
            this.close();
        }
    }

    // Checks if a game exists in the list.
    private checkIfExists(gamesId: number[]): boolean {
        for (const game of gamesId) {
            if (game === this.game.id) {
                this._databaseService.toast(' already exists in this list. Please select another.', this.game.title);
                return true;
            }
        }
        return false;
    }

    async addList() {
        const modal = await this.modalController.create({
            component: NewListPage,
            componentProps: {
                gameId: this.game.id,
                gameTitle: this.game.title
            }
        });
        modal.onDidDismiss().then(() => this.close());
        return await modal.present();
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

}
