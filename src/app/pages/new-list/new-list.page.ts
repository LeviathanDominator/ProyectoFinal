import { Component, OnInit } from '@angular/core';
import {DatabaseService} from '../../services/database.service';
import {AuthService} from '../../services/auth.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-new-list',
  templateUrl: './new-list.page.html',
  styleUrls: ['./new-list.page.scss'],
})
export class NewListPage implements OnInit {

  name: string;
  userId: string;

  constructor( private _databaseService: DatabaseService, private _authService: AuthService,
               private modalController: ModalController) {
    this.name = '';
    // TODO Dont take current user. Take user got by the url parameter.
    _authService.user.subscribe(user => {
      this.userId = user.uid;
    });
  }

  ngOnInit() {
  }

  createList() {
    this._databaseService.newList(this.userId, this.name).then(() => this.close());
  }

  close() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
