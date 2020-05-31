import {Component, OnInit} from '@angular/core';
import {Label} from '../../models/label.model';
import {DatabaseService} from '../../services/database.service';

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

    labels: Label[] = [];

    // tslint:disable-next-line:variable-name
    constructor(private _databaseService: DatabaseService) {
        this._databaseService.getLabelsCollection().subscribe(labels => {
            for (const label of labels) {
                this.labels.push(_databaseService.dataToLabel(label));
            }
        });
    }

    ngOnInit() {
    }

}
