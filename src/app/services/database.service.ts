/* tslint:disable:no-string-literal */
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Label} from '../models/label.model';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Message} from '../models/message.model';
import {AlertController, ToastController} from '@ionic/angular';
import {List} from '../models/list.model';
import {Game} from '../models/game.model';
import {Filter} from '../models/filter.model';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    nameLength = 30; // Max length for name input.
    filters: Filter[]; // Filters for labels.

    // tslint:disable-next-line:variable-name
    constructor(private router: Router, private firestore: AngularFirestore, private _authService: AuthService,
                private toastController: ToastController, private alertController: AlertController) {
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

    getLabel(id: number) {
        return this.firestore.collection('/labels').doc(String(id)).valueChanges();
    }

    dataToLabel(data: any) {
        return new Label(data.id, data.name, data.description, data.descriptionLarge);
    }

    suggestLabel(userId: string, gameId: number, label: any) {
        return this.firestore.collection('/suggestions').doc(userId).collection('/games').doc(String(gameId)).set({
           label
        });
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
        const user = new User(data.id, data.name, data.email, data.signUpDate);
        if (data.description) {
            user.description = data.description;
        }
        return user;
    }

    updateUser(user: User) {
        this.firestore.collection('/users').doc(user.id).set({
            id: user.id,
            name: user.name,
            description: user.description,
            email: user.email,
            signUpDate: user.signUpDate,
        });
    }

    getAdmins() {
        return this.firestore.collection('/admins').valueChanges();
    }

    getMessages(id: string) {
        return this.firestore.collection('/users').doc(id).collection('messages').valueChanges();
    }

    // Sends a message to the receiver user.
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

    // Deletes a list from the database.
    deleteList(userId: string, list: List) {
        this.firestore.collection('/users').doc(userId).collection('/lists').doc(list.id).delete()
            .then(() => this.toast('List "' + list.name + '" deleted'));
    }

    // Deletes a message from the database.
    deleteMessage(message: Message) {
        this.firestore.collection('/users').doc(message.receiver).collection('/messages').doc(message.id).delete()
            .then(() => this.toast('Message deleted'));
    }

    // Marks a message as read when the user opens it.
    markMessageAsRead(message: Message) {
        return this.firestore.collection('/users').doc(message.receiver).collection('/messages').doc(message.id).set({
            receiverId: message.receiver,
            senderId: message.sender,
            message: message.message,
            timeAndDate: message.date,
            read: true,
        });
    }

    // Turns data into a Message object.
    dataToMessage(data: any) {
        return new Message(data.message, data.senderId, data.receiverId, data.timeAndDate, data.read);
    }

    // Gets the current date. If raw is true it returns numbers only.
    currentDate(raw: boolean) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return raw ? dd + mm + yyyy : dd + '/' + mm + '/' + yyyy;
    }

    // Gets the current time and date. If raw is true it returns numbers only.
    currentTimeAndDate(raw: boolean) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const time = raw ? today.getHours() + today.getMinutes() + today.getSeconds()
            : today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        return raw ? time + dd + mm + yyyy : time + ' ' + dd + '/' + mm + '/' + yyyy;
    }

    // Shows a custom toast.
    async toast(message: string, name?: string) {
        if (!name) {
            name = '';
        }
        const toast = await this.toastController.create({
            message: name + message,
            duration: 2000,
            position: 'bottom'
        });
        await toast.present();
    }

    // This method checks if the game's labels matches the filters.
    matchesCriteria(labels: Label[]): boolean {
        if (this.filters) {
            for (const label of labels) {
                if (this.filters[label.id] === Filter.no) {
                    return false;
                }
            }
            for (let i = 0; i < this.filters.length; i++) {
                const filter = this.filters[i];
                if (filter === Filter.yes) {
                    if (!this.exist(labels, i)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    // This method checks if a filter (represented as a number) exists in a group of labels.
    // Returns true the moment it finds it.
    private exist(labels: Label[], i: number) {
        for (const label of labels) {
            if (Number(label.id) === i) {
                return true;
            }
        }
        return false;
    }

    // Shows an alert when no Internet connection is available.
    async noConnectionAlert() {
        const alert = await this.alertController.create({
            header: 'Error',
            message: 'Couldn\'t connect to database. Make sure you have Internet connection.',
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                    cssClass: 'secondary'
                }
            ]
        });
        await alert.present();
    }

    // Shows an alert with specified header and message.
    async customAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header: 'Error',
            message,
            buttons: [
                {
                    text: 'Ok',
                    role: 'cancel',
                    cssClass: 'secondary'
                }
            ]
        });
        await alert.present();
    }
}
