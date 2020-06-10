import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {DatabaseService} from './database.service';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    storage;

    // tslint:disable-next-line:variable-name
    constructor(private _databaseService: DatabaseService) {
        this.storage = firebase.storage().ref();
    }

    uploadAvatar(userId: string, image: string) {
        console.log(image);
        const avatarRef = this.storage.child(`avatars/${userId}`);
        return avatarRef.putString('data:image/jpeg;base64,' + image, 'data_url', {contentType: 'image/jpg'}).then(success => {
            this._databaseService.toast('Your new avatar has been uploaded successfully.');
            console.log(success);
        }).catch(error => {
            console.log(error);
        });
    }

    getAvatar(id: string) {
        return this.storage.child(`avatars/${id}`).getDownloadURL();
    }

    uploadBanner(userId: string, image: string) {
        const avatarRef = this.storage.child(`banners/${userId}`);
        return avatarRef.putString('data:image/jpeg;base64,' + image, 'data_url', {contentType: 'image/jpg'}).then(success => {
            this._databaseService.toast('Your new banner has been uploaded successfully.');
            console.log(success);
        }).catch(error => {
            console.log(error);
        });
    }

    getBanner(id: string) {
        return this.storage.child(`banners/${id}`).getDownloadURL();
    }

}
