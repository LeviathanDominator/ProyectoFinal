import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Label} from '../models/label.model';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Message} from '../models/message.model';
import {ToastController} from '@ionic/angular';
import {List} from '../models/list.model';
import {Game} from '../models/game.model';

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

    getGame(id: number) {
        return this.firestore.collection('/games').doc(String(id)).valueChanges();
    }

    getLabelsCollection() {
        return this.firestore.collection('/labels').valueChanges();
    }

    getLabels(id: number) {
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

    newList(userId: string, name: string) {
        const id = this.currentTimeAndDate(true);
        return this.firestore.collection('/users').doc(userId).collection('/lists').doc(id).set({
            id,
            name,
            games: []
        });
    }

    addGameToList(list: List, game: Game) {
        this._authService.user.subscribe(user => {
            list.games.push(game.id);
            this.updateList(user['uid'], list).then(() => this.toast(' added to list "' + list.name + '"', game.title));
        });
    }

    updateList(userId: string, list: List, games?: Game[]) {
        const gameIds = [];
        if (games) {
            for (const game of games) {
                gameIds.push(game.id);
            }
        } else {
            for (const game of list.games) {
                gameIds.push(game);
            }
        }
        return this.firestore.collection('/users').doc(userId).collection('/lists').doc(list.id).set({
            id: list.id,
            name: list.name,
            games: gameIds
        });
    }

    dataToList(data: any) {
        return new List(data.id, data.name, data.games);
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

    deleteList(userId: string, list: List) {
        this.firestore.collection('/users').doc(userId).collection('/lists').doc(list.id).delete()
            .then(() => this.toast('List "' + list.name + '" deleted'));
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

    // TODO Fix some filters not filtering right
    matchesCriteria(labels: Label[]) {
        if (this.filters) {
            for (const label of labels) {
                if (this.filters[label.id] == 'no') {
                    return false;
                }
            }
            for (let i = 0; i < this.filters.length; i++) {
                const filter = this.filters[i];
                if (filter == 'yes') {
                    if (!this.exist(labels, i)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    private exist(labels: Label[], i: number) {
        for (const label of labels) {
            if (Number(label.id) == i) {
                return true;
            }
        }
        return false;
    }
}
