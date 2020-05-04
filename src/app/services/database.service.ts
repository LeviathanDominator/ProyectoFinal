import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Label} from "../models/label.model";
import {User} from "../models/user.model";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private router: Router, private firestore: AngularFirestore, private _authService: AuthService) {
    }

    getBarcodeGame(barcode: string) {
        return this.firestore.collection('/barcode').doc(barcode).valueChanges();
    }

    addBarcodeGame(barcode: string, id: number) {
        this.addGame(id.toString());
        return this.firestore.collection('/barcode').doc(barcode).set({
            id
        });
    }

    getGame(id: string) {
        return this.firestore.collection('/games').doc(id).valueChanges();
    }

    getLabelsCollection() {
        return this.firestore.collection('/labels').valueChanges();
    }

    getLabelsByUser(id: number, userId: string) {
        return this.firestore.collection('/users').doc(userId).collection('/labeledGames').doc(String(id)).valueChanges();
    }

    getLabels(id: number) {
        // TODO Get labels for game specified.
    }



    addGame(id: string) {
        const labels = [];
        return this.firestore.collection('/games').doc(id).set({
            labels
        });
    }

    getLabel(id: string) {
        return this.firestore.collection('/labels').doc(id).valueChanges();
    }

    getUsers() {
        return this.firestore.collection('/users').valueChanges();
    }

    getUser(id: string) {
        return this.firestore.collection(`/users`).doc(id).valueChanges();
    }

    /*getAverageLabels(id: string) {
        return this.firestore.collection('/users', ref => ref.where());
    }*/

    setLabel(id: string, data: any[]) {
        let userId: string;
        const labels: string[] = [];
        let length: number = 0;
        for (let label in data) {
            length++;
        }
        console.log("Data length", length);
        for (let i = 0; i < length; i++) {
            if (data[i]) {
                labels.push(String(i));
            }
        }
        console.log(labels);
        this._authService.user.subscribe(user => {
            userId = user.uid;
            console.log(userId, id);
            return this.firestore.collection('/users').doc(userId).collection("/labeledGames").doc(String(id)).set({
                labels
            });
        });

    }

    goToUser(id: string) {
        this.router.navigate(['/user', id]);
    }
}
