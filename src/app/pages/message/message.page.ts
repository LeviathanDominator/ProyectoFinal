import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {DatabaseService} from "../../services/database.service";
import {AuthService} from "../../services/auth.service";
import {Message} from "../../models/message.model";

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
})
export class MessagePage implements OnInit {

  message: Message;

  constructor(private navParams: NavParams, private modalController: ModalController,
              private _databaseService: DatabaseService, private _authService: AuthService) {
    this.message = this.navParams.get('message');
    this._databaseService.getUser(this.message.sender).subscribe(sender => {
      this.message.senderName = sender['name'];
    });
    _databaseService.markMessageAsRead(this.message);
    console.log(this.message);
  }

  ngOnInit() {
  }

    deleteMessage() {
        this._databaseService.deleteMessage(this.message);
        this.modalController.dismiss();
    }
}
