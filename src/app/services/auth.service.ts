import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import * as firebase from 'firebase';
import {User} from '../models/user.model';
import {AlertController} from '@ionic/angular';

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



    constructor(private firebaseAuth: AngularFireAuth, private firestore: AngularFirestore, private alertController: AlertController) {
        this.user = this.firebaseAuth.authState;
    }

    login(value: any) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    console.log('Success: ', res);
                    resolve(res);
                }, err => {
                    console.log('Error: ', err);
                    this.alert('Error signing in', err.message, true);
                    reject(err);
                });
        });
    }

    register(user: User, password: string) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(user.email, password)
                .then(res => {
                    user.id = res.user.uid;
                    this.addUserToDatabase(user);
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

    private addUserToDatabase(user: User) {
        console.log(user);
        this.firestore.collection('/users').doc(user.id).set({
            id: user.id,
            name: user.name,
            email: user.email,
            signUpDate: user.signUpDate,
        }).then(res => console.log(res));
    }

    logout() {
        firebase.auth().signOut().then(r => console.log(r));
        this.user = null;
        this.currentUser = null;
    }

    // Forces the app to reload to refresh auth changes.
    reloadApp() {
        document.location.href = 'index.html';
    }
}
