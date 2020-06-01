import {Injectable} from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    storage;

    constructor() {
        this.storage = firebase.storage().ref();
    }

    uploadAvatar(userId: string, image: string) {
        const avatarRef = this.storage.child(`avatars/${userId}`);
        avatarRef.putString('data:image/jpeg;base64,' + image, 'data_url', {contentType: 'image/jpg'}).then(success => {
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
        avatarRef.putString('data:image/jpeg;base64,' + image, 'data_url', {contentType: 'image/jpg'}).then(success => {
            console.log(success);
        }).catch(error => {
            console.log(error);
        });
    }

    getBanner(id: string) {
        return this.storage.child(`banners/${id}`).getDownloadURL();
    }

}
