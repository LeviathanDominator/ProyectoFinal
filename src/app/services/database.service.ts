import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import {Label} from "../models/label.model";

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
        this.addGame(id.toString());
        return this.firestore.collection('/barcode').doc(barcode).set({
            id
        });
    }

    getGame(id: string) {
        return this.firestore.collection('/games').doc(id).valueChanges();
    }

    /*getLabels(id: string) {
        return this.firestore.collection('/labels').doc(id).valueChanges();
    }*/

    getLabels(id: number): Label[] {
        const labels: Label[] = [];
        this.getGame(String(id)).subscribe(gameLabels => {
            if (gameLabels["labels"]) {
                console.log("GameLabels", gameLabels["labels"]);
                for (let gameLabel of gameLabels["labels"]) {
                    this.getLabel(gameLabel).subscribe(labelData => {
                        if (labelData) {
                            const label = new Label();
                            label.name = labelData["name"];
                            label.description = labelData["description"];
                            labels.push(label);
                            console.log(label);
                        }
                    });
                }
            } else {
                this.addGame(String(id))
            }
        })
        return labels;
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
}
