import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Label} from "../models/label.model";
import {User} from "../models/user.model";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {Platform} from "../models/platform.model";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    filters: string[];

    constructor(private router: Router, private firestore: AngularFirestore, private _authService: AuthService) {
    }

    getBarcodeGame(barcode: string) {
        return this.firestore.collection('/barcode').doc(barcode).valueChanges();
    }

    addBarcodeGame(barcode: string, id: number) {
        this.addGame(id);
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
        return this.firestore.collection('/games').doc(String(id)).valueChanges();
    }



    addGame(id: number) {
        const labels = [];
        const description = "";
        return this.firestore.collection('/games').doc(String(id)).set({
            labels,
            description,
        });
    }

    getLabel(id: string) {
        return this.firestore.collection('/labels').doc(id).valueChanges();
    }

    dataToLabel(data: Object) {
        console.log("IMPORTANT", data)
        return new Label(data['id'], data['name'], data['description'], data['descriptionLarge']);
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

    getLists(id: string) {
        return this.firestore.collection('/users').doc(id).collection('/lists').valueChanges();
    }

    getList(id: string, userId: string) {
        return this.firestore.collection('/users').doc(userId).collection('/lists').doc(id).valueChanges();
    }

    setFilter(data: any) {
        this.filters = new Array<any>(data.length);
        for (let filter of data){
            this.filters[filter['id']] = filter['selectedFilter'];
        }
        console.log("New filters", this.filters);
    }
}
