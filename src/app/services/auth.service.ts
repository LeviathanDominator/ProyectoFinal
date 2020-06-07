import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {User} from '../models/user.model';
import {AlertController, Platform} from '@ionic/angular';
import {GooglePlus} from '@ionic-native/google-plus/ngx';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<firebase.User>;
    // tslint:disable-next-line:only-arrow-functions
    currentUser = firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            return user;
        } else {
            return null;
        }
    });

    constructor(private firebaseAuth: AngularFireAuth, private firestore: AngularFirestore,
                private alertController: AlertController, private platform: Platform, private googlePlus: GooglePlus) {
        this.user = this.firebaseAuth.authState;
    }

    login(value: any) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    resolve(res);
                }, err => {
                    console.log('Error: ', err);
                    this.alert('Error signing in', err.message, true);
                    reject(err);
                });
        });
    }

    loginGoogle() {
        return this.platform.is('android') ? this.loginGoogleAndroid() : this.loginGoogleWeb();
    }

    async loginGoogleAndroid() {
        const res = await this.googlePlus.login({
            webClientId: '100817615086-5jv8pbal136rofbrgad483dkeikteg8t.apps.googleusercontent.com',
            offline: true
        });
        const resConfirmed = await this.firebaseAuth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken));
        return resConfirmed.user;
    }

    async loginGoogleWeb() {
        const google = await this.firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        return google.user;
    }

    register(user: User, password: string) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(user.email, password)
                .then(res => {
                    user.id = res.user.uid;
                    resolve(res);
                }, err => {
                    this.alert('Error signing up', err.message, true);
                    reject(err);
                });
        });
    }

    async alert(header: string, message: string, error: boolean) {
        const alert = await this.alertController.create({
            header,
            message: error ? this.errorMessage(message) : message,
            buttons: ['OK']
        });

        await alert.present();
    }

    // Logs user out and reloads app to prevent errors.
    logout() {
        firebase.auth().signOut().then(() => {
            this.user = null;
            this.currentUser = null;
            this.reloadApp();
        });
    }

    // Forces the app to reload to refresh auth changes.
    reloadApp() {
        document.location.href = 'index.html';
    }

    errorMessage(error: string) {
        switch (error) {
            case 'auth/user-not-found':
                return 'User doesn\'t exist';
            case 'auth/missing-email':
                return 'An email address is required';
            case 'auth/invalid-email':
                return 'The email address is not valid';
            case 'auth/argument-error':
                return 'You must input a password';
            case 'auth/wrong-password':
                return 'The password is wrong';
            case 'auth/weak-password':
                return 'The password is too shot';
            default:
                return error;
        }
    }
}
