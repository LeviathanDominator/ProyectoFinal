/* tslint:disable:variable-name no-string-literal */
import {Component, OnInit, SecurityContext} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {DatabaseService} from '../../services/database.service';
import {User} from '../../models/user.model';
import {NavController} from '@ionic/angular';
import {Camera} from '@ionic-native/camera/ngx';
import {StorageService} from '../../services/storage.service';
import {DomSanitizer} from '@angular/platform-browser';
import * as firebase from 'firebase';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

    user: User = new User();
    imageOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: 0,
    };

    constructor(private _authService: AuthService, private _databaseService: DatabaseService,
                private _storageService: StorageService, private sanitizer: DomSanitizer,
                private navController: NavController, private camera: Camera) {
        _authService.user.subscribe(user => {
            if (user) {
                this._databaseService.getUser(user.uid).subscribe(userData => {
                    this.user = this._databaseService.dataToUser(userData);
                    this._storageService.getAvatar(this.user.id).then(url => {
                        this.user.avatar = url;
                    }).catch(() => console.log('No custom avatar set'));
                    this._storageService.getBanner(this.user.id).then(url => {
                        this.user.banner = url;
                    }).catch(() => console.log('No custom banner set'));
                });
            } else {
                navController.navigateBack('home');
            }
        });
    }

    ngOnInit() {
    }

    setNewAvatar() {
        this.camera.getPicture(this.imageOptions).then(imageData => {
            console.log('Image data', imageData);
            this._storageService.uploadAvatar(this.user.id, imageData);
        }).catch(error => {
            this._databaseService.customAlert('Error', error);
            console.log('Error', error);
        });
    }

    setNewBanner() {
        this.camera.getPicture(this.imageOptions).then(imageData => {
            console.log('Image data', imageData);
            this._storageService.uploadBanner(this.user.id, imageData);
        }).catch(error => {
            this._databaseService.customAlert('Error', error);
            console.log('Error', error);
        });
    }

    editProfile() {

    }
}
