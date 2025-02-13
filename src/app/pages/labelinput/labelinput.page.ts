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
    selectedLabels: boolean[];

    constructor(private _databaseService: DatabaseService, private _authService: AuthService,
                private modalController: ModalController) {
        _databaseService.getLabelsCollection().subscribe(labels => {
            this.labels = [];
            this.selectedLabels = [];
            for (const label of labels) {
                this.labels.push(this._databaseService.dataToLabel(label));
                this.selectedLabels.push(false);
            }
            this._databaseService.sortLabels(this.labels);
        }, (error => {
            console.log(error);
            _databaseService.noConnectionAlert();
        }));
    }

    ngOnInit() {
    }

    setLabel(form: any) {
        if (this.checkIfAllAreFalse(form['value'])) {
            this._databaseService.toast('You need to check at least one label.');
            return;
        }
        this._authService.user.subscribe(user => {
            if (user) {
                this._databaseService.suggestLabel(user.uid, this.id, form['value'])
                    .then(() => {
                        this._databaseService.toast('Your label suggestion has been sent! Thank you!');
                        this.close();
                    });
            }
        });
    }

    private checkIfAllAreFalse(labels: any) {
        for (const label of Object.keys(labels)) {
            if (labels[label]) {
                return false;
            }
        }
        return true;
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

}
