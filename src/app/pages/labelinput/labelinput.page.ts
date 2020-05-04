import {Component, OnInit} from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {Label} from "../../models/label.model";

@Component({
    selector: 'app-labelinput',
    templateUrl: './labelinput.page.html',
    styleUrls: ['./labelinput.page.scss'],
})
export class LabelinputPage implements OnInit {
    id;
    title;
    labels: Label[];

    constructor(private _databaseService: DatabaseService) {
        this.labels = [];
        _databaseService.getLabelsCollection().subscribe(labels => {
            console.log(labels);
            for (let i = 0; i < labels.length; i++) {
                const label = new Label();
                label.id = String(i);
                label.name = labels[i]['name'];
                label.description = labels[i]['description'];
                this.labels.push(label);
            }
        });
    }

    ngOnInit() {
    }

    setLabel(form: any) {
        this._databaseService.getLabels(3498);
        //this._databaseService.setLabel(this.id, form['value']);
    }
}
