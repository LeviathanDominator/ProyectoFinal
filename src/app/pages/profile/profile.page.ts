import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import { Camera, CameraOptions } from '@ionic-native/camera';
import {DatabaseService} from "../../services/database.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User = new User();
  imageSrc: string;

  constructor(private _authService: AuthService, private _databaseService: DatabaseService) {
    _authService.user.subscribe(user => {
      this._databaseService.getUser(user['uid']).subscribe(user => {
        this.user.id = user['id'];
        this.user.name = user['name'];
        this.user.email = user['email'];
      });
    });
  }

  ngOnInit() {
  }

    setNewAvatar() {
    console.log(this.imageSrc);
      /*const options: CameraOptions = {
        quality: 100,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE
      }
      Camera.getPicture(options)
          .then(file_uri => this.imageSrc = file_uri,
              err => console.log(err));*/
    }
}
