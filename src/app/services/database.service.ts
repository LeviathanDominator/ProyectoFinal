import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    constructor(private firestore: AngularFirestore) {
    }

    getBarcodeGame(code: string) {
        return this.firestore.collection('/barcode').doc(code).valueChanges();
    }

    addBarcodeGame(barcode: string, id: number) {
        return this.firestore.collection('/barcode').doc(barcode).set({
            id
        });
    }
}
