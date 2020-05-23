import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Label} from '../models/label.model';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Message} from '../models/message.model';
import {ToastController} from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    filters: string[];

    constructor(private router: Router, private firestore: AngularFirestore, private _authService: AuthService,
                private toastController: ToastController) {
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
        const description = '';
        return this.firestore.collection('/games').doc(String(id)).set({
            labels,
            description,
        });
    }

    getLabel(id: string) {
        return this.firestore.collection('/labels').doc(id).valueChanges();
    }

    dataToLabel(data: any) {
        return new Label(data.id, data.name, data.description, data.descriptionLarge);
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
        let length = 0;
        for (const label in data) {
            length++;
        }
        console.log('Data length', length);
        for (let i = 0; i < length; i++) {
            if (data[i]) {
                labels.push(String(i));
            }
        }
        console.log(labels);
        this._authService.user.subscribe(user => {
            userId = user.uid;
            console.log(userId, id);
            return this.firestore.collection('/users').doc(userId).collection('/labeledGames').doc(String(id)).set({
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
        for (const filter of data) {
            this.filters[filter.id] = filter.selectedFilter;
        }
    }

    getAdmin() {
        this._authService.user.subscribe(user => {
            return this.firestore.collection('/users').doc(user.uid).valueChanges();
        });
    }

    isAdmin() {
        console.log('Is admin', this.getAdmin());
    }

    newList(userId: string, id: number, name: string) {
        return this.firestore.collection('/users').doc(userId).collection('/lists').doc(String(id)).set({
            name
        });
    }

    dataToUser(data: any) {
        return new User(data.id, data.name, data.email, data.signUpDate);
    }

    getMessages(id: string) {
        return this.firestore.collection('/users').doc(id).collection('messages').valueChanges();
    }

    sendMessage(senderId: string, receiverId: string, messageString: string) {
        const message = new Message(messageString, senderId, receiverId, this.currentTimeAndDate(false));
        console.log(message);
        return this.firestore.collection('/users').doc(message.receiver).collection('/messages').doc(message.id).set({
            receiverId: message.receiver,
            senderId: message.sender,
            message: message.message,
            timeAndDate: message.date,
            read: false,
        });
    }

    deleteMessage(message: Message) {
        this.firestore.collection('/users').doc(message.receiver).collection('/messages').doc(message.id).delete()
            .then(() => this.toast('Message deleted'));
    }

    markMessageAsRead(message: Message) {
        return this.firestore.collection('/users').doc(message.receiver).collection('/messages').doc(message.id).set({
            receiverId: message.receiver,
            senderId: message.sender,
            message: message.message,
            timeAndDate: message.date,
            read: true,
        });
    }

    dataToMessage(data: any) {
        return new Message(data.message, data.senderId, data.receiverId, data.timeAndDate, data.read);
    }

    currentDate(raw: boolean) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return raw ? dd + mm + yyyy : dd + '/' + mm + '/' + yyyy;
    }

    currentTimeAndDate(raw: boolean) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const time = raw ? today.getHours() + today.getMinutes() + today.getSeconds()
            : today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        return raw ? time + dd + mm + yyyy : time + ' ' + dd + '/' + mm + '/' + yyyy;
    }

    async toast(message: string, name?: string) {
        const toast = await this.toastController.create({
            message: name + message,
            duration: 2000,
            position: 'top'
        });
        await toast.present();
    }
}
