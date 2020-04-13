import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private firestore: AngularFirestore) {
    }

    getBarcodeGame(barcode: string) {
        return this.firestore.collection('/barcode').doc(barcode).valueChanges();
    }

    addBarcodeGame(barcode: string, id: number) {
        var labels: number[] = [1, 3, 5];
        this.addGame(id.toString(), labels);
        return this.firestore.collection('/barcode').doc(barcode).set({
            id
        });
    }

    getGame(id: string) {
        return this.firestore.collection('/games').doc(id).valueChanges();
    }

    addGame(id: string, labels: number[]) {
        console.log("Game id", id);
        console.log("Labels id", labels);
        return this.firestore.collection('/games').doc(id).set({
            labels
        });
    }

    getLabel(id: string) {
        return this.firestore.collection('/labels').doc(id).valueChanges();
    }
}
