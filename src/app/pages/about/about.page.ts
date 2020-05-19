import { Component, OnInit } from '@angular/core';
import {Label} from "../../models/label.model";
import {DatabaseService} from "../../services/database.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  labels: Label[] = [];
  constructor(private _databaseService: DatabaseService) {
    this._databaseService.getLabelsCollection().subscribe(labels => {
      for (let label of labels){
        /*let newLabel = new Label();
        newLabel.name = labels[i]['name'];
        newLabel.description = labels[i]['description'];
        newLabel.descriptionLarge = labels[i]['descriptionLarge']
        console.log(newLabel)*/
        this.labels.push(_databaseService.dataToLabel(label));
      }
    });
  }

  ngOnInit() {
  }

}
