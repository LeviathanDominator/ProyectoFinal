/* tslint:disable:no-string-literal variable-name */
import {Component, OnInit} from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {Label} from '../../models/label.model';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';

@Component({
    selector: 'app-labelinput',
    templateUrl: './labelinput.page.html',
    styleUrls: ['./labelinput.page.scss'],
})
export class LabelinputPage implements OnInit {
    id;
    title;
    labels: Label[];

    constructor(private _databaseService: DatabaseService, private _authService: AuthService,
                private modalController: ModalController) {
        _databaseService.getLabelsCollection().subscribe(labels => {
            this.labels = [];
            for (let i = 0; i < labels.length; i++) {
                this.labels.push(new Label(i, labels[i]['name'], labels[i]['description'], labels[i]['descriptionLarge']));
            }
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    setLabel(form: any) {
        this._authService.user.subscribe(user => {
            if (user) {
                this._databaseService.suggestLabel(user.uid, this.id, form['value'])
                    .then(() => {
                        this._databaseService.toast('Thank you for sending your suggestions! An admin will check them out soon.');
                        this.close();
                    });
            }
        });
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

}
