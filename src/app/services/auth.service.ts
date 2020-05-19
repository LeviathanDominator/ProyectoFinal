import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import * as firebase from "firebase";
import {User} from "../models/user.model";

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

    register(user: User, password: string) {
        return new Promise<any>((resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(user.email, password)
                .then(res => {
                    user.id = res.user.uid;
                    this.addUserToDatabase(user);
                    resolve(res);
                }, err => reject(err))
        })
    }

    private addUserToDatabase(user: User) {
        console.log(user);
        this.firestore.collection('/users').doc(user.id).set({
            id: user.id,
            name: user.name,
            isAdmin: false,
            labeledGames: [],
        }).then(res => console.log(res));
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
        firebase.auth().signOut().then(r => console.log(r));
        this.user = null;
        this.currentUser = null;
    }


}
