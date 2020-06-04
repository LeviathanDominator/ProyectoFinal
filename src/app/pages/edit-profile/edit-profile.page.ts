/* tslint:disable:variable-name */
import {Component, OnInit} from '@angular/core';
import {User} from '../../models/user.model';
import {ModalController, NavParams} from '@ionic/angular';
import {DatabaseService} from '../../services/database.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.page.html',
    styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

    user: User;

    constructor(private navParams: NavParams, private modalController: ModalController, private _databaseService: DatabaseService) {
        const userId = this.navParams.get('userId');
        if (userId) {
            this.close();
        }
        this._databaseService.getUser(userId).subscribe(user => {
            this.user = this._databaseService.dataToUser(user);
        });
    }

    ngOnInit() {
    }

    editProfile() {
        // tslint:disable-next-line:triple-equals
        if (this.user.name.length == 0) {
          this._databaseService.toast('Name input cannot be empty.');
          return;
        } else if (this.user.name.length > this._databaseService.nameLength) {
            this._databaseService.toast('Your name is too long.');
            return;
        }
        this._databaseService.updateUser(this.user);
        this._databaseService.toast(`Your profile has been updated, ${this.user.name}.`);
        this.close();
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
