/* tslint:disable:variable-name no-string-literal */
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {User} from '../../models/user.model';
import {NavController} from '@ionic/angular';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    user: User = new User();
    imageSrc: string;

    constructor(private _authService: AuthService, private _databaseService: DatabaseService,
                private navController: NavController) {
        _authService.user.subscribe(user => {
            if (user) {
                this._databaseService.getUser(user.uid).subscribe(userData => {
                    this.user = this._databaseService.dataToUser(userData);
                    this.user.id = userData['id'];
                    this.user.name = userData['name'];
                    this.user.email = userData['email'];
                });
            } else {
                navController.navigateBack('home');
            }
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
