import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../services/database.service";
import {Label} from "../../models/label.model";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {

  labels: Label[];

  constructor(private _databaseService: DatabaseService, private modalController: ModalController) {
    this._databaseService.getLabelsCollection().subscribe(labels => {
      this.labels = [];
      for (let label of labels){
        const newLabel = this._databaseService.dataToLabel(label);
        if (this._databaseService.filters){
          newLabel.selectedFilter = this._databaseService.filters[newLabel.id];
        }
        this.labels.push(newLabel);
      }
    });
  }

  ngOnInit() {
  }

  setFilter() {
    this.modalController.dismiss({
      dismissed: true,
      filters: this.labels,
    });
  }
}
