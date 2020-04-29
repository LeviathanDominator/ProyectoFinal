import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import * as firebase from "firebase";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    user: Observable<firebase.User>
    currentUser = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            return user;
        } else {
            return null;
        }
    });


    constructor(private firebaseAuth: AngularFireAuth, private firestore: AngularFirestore) {
        this.user = this.firebaseAuth.authState;
        /*this.user = this.firebaseAuth.authState;
        this.user.subscribe(params => {
            console.log("User", params);
            if (params != null) {
                // @ts-ignore
                this.userId = params.Y.W;
            }
        });*/
    }

    register(value: any) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    resolve(res);
                }, err => reject(err))
        })
    }

    login(value: any) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    console.log("Success: ", res);
                    resolve(res);
                }, err => {
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }

    logout(){
        this.user = null;
        this.currentUser = null;
    }

    getUser() {
        return this.user;
    }
}
