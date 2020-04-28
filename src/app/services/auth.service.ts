import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import * as firebase from "firebase";

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private currentUser = firebase.auth().currentUser;

    constructor(private firebaseAuth: AngularFireAuth, private firestore: AngularFirestore) {
        /*this.user = this.firebaseAuth.authState;
        this.user.subscribe(params => {
            console.log("User", params);
            if (params != null) {
                // @ts-ignore
                this.userId = params.Y.W;
            }
        });*/
    }

    user(): firebase.User {
        return this.currentUser;
    }

    register(value: any) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    resolve(res);
                }, err => reject(err))
        })
    }

    login(value: any){
        return new Promise<any>((resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(value.email, value.password)
                .then(res => {
                    resolve(res);
                }, err => reject(err))
        })
    }

}
