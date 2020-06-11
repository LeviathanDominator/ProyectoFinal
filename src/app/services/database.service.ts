/* tslint:disable:no-string-literal triple-equals */
import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Label} from '../models/label.model';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {Message} from '../models/message.model';
import {AlertController, LoadingController, ToastController} from '@ionic/angular';
import {List} from '../models/list.model';
import {Game} from '../models/game.model';
import {Filter} from '../models/filter.model';
import {FireSQL} from 'firesql';
import * as firebase from 'firebase';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private fireSql = new FireSQL(firebase.firestore());
    nameLength = 30; // Max length for name input.
    filters: Filter[]; // Filters for labels.
    labelsLength; // Number of labels in database.

    // tslint:disable-next-line:variable-name
    constructor(private router: Router, private firestore: AngularFirestore, private _authService: AuthService,
                private toastController: ToastController, private alertController: AlertController,
                private loadingController: LoadingController) {
        this.getLabelsCollection().subscribe(labels => {
            this.labelsLength = labels.length;
        });
    }

    getBarcodeGame(barcode: string) {
        return this.firestore.collection('/barcode').doc(barcode).valueChanges();
    }

    getLabelsCollection() {
        return this.firestore.collection('/labels').valueChanges();
    }

    getLabels(id: number) {
        return this.firestore.collection('/games').doc(String(id)).valueChanges();
    }

    getLabel(id: number) {
        return this.firestore.collection('/labels').doc(String(id)).valueChanges();
    }

    dataToLabel(data: any) {
        return new Label(data.id, data.name, data.description, data.descriptionLarge);
    }

    // Set a suggestion for the labels of a game with gameId and userId.
    // It's made this way because collections within collections cannot be used in FireSQL.
    suggestLabel(userId: string, gameId: number, labelsData: any) {
        const labels = [];
        for (let i = 0; i < Object.keys(labelsData).length; i++) {
            console.log(labelsData[i]);
            if (labelsData[i]) {
                labels.push(i);
            }
        }
        return this.firestore.collection('/suggestions').doc(String(gameId + userId)).set({
            labels,
            gameId
        });
    }

    // Uses an SQL statement to get every suggestion voted for every user to calculate average of labels in a game.
    // If a label has the majority of votes, it will show.
    getAverageLabels(gameId: number) {
        return new Promise(resolve => {
            this.fireSql.query(`SELECT labels FROM suggestions WHERE gameId = ${gameId}`).then(documents => {
                // tslint:disable-next-line:triple-equals
                if (documents.length == 0) {
                    resolve(undefined);
                }
                const result: number[] = [];
                const labels = new Array<number>(this.labelsLength);
                for (let i = 0; i < labels.length; i++) {
                    labels[i] = 0;
                }
                const size = documents.length;
                for (const document of documents) {
                    const data = document['labels'];
                    for (let i = 0; i < Object.keys(data).length; i++) {
                        labels[data[i]]++;
                    }
                }
                for (let i = 0; i < labels.length; i++) {
                    if (labels[i] >= size / 2) {
                        result.push(i);
                    }
                }
                resolve(result);
            }).catch(() => {
                resolve(undefined);
            });
        });
    }


    // This method receives a Game and adds the labels accepted by the average of suggestions.
    getAverageLabelsData(game: Game) {
        this.getAverageLabels(game.id).then(suggestions => {
            if (suggestions) {
                for (const suggestion of Object.keys(suggestions)) {
                    this.getLabel(suggestions[suggestion]).subscribe(label => {
                        if (game.labels) {
                            game.labels.push(this.dataToLabel(label));
                        }
                    });
                }
            }
        });
    }

    // Sort label by id.
    sortLabels(labels: Label[]) {
        labels.sort((a, b) => {
            if (a.id > b.id) {
                return 1;
            }
            if (a.id < b.id) {
                return -1;
            }
            return 0;
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

    // Creates a new list. Id is generated by current time and date.
    newList(userId: string, name: string, gameId?: number) {
        const id = this.currentTimeAndDate(true);
        const games: number[] = [];
        if (gameId) {
            games.push(gameId);
        }
        return this.firestore.collection('/users').doc(userId).collection('/lists').doc(id).set({
            id,
            name,
            games
        });
    }

    addGameToList(list: List, game: Game) {
        this._authService.user.subscribe(user => {
            list.games.push(game.id);
            this.updateList(user['uid'], list).then(() => this.toast(' added to list "' + list.name + '"', game.title));
        });
    }

    // Updates a list. If a new game is added, which means 'games' variable is not undefined, it will add it to the
    // last position of the list. If it is undefined, it means the list has been updated because a game on that list
    // has changed position.
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
        const date = moment(data.signUpDate, 'DD/MM/YYYY').toDate();
        const user = new User(data.id, data.name, data.email, date, data.steam, data.playstation,
            data.xbox);
        if (data.description) {
            user.description = data.description;
        }
        return user;
    }

    addUserToDatabase(user: User) {
        return this.firestore.collection('/users').doc(user.id).set({
            id: user.id,
            name: user.name,
            email: user.email,
            signUpDate: user.parseDate(),
            avatar: user.avatar,
        });
    }

    // When an user edits its profile some fields can be empty, because not every user has a Steam account por example.
    // However, you cannot send undefined data to Firebase, so it must be initialized.
    updateUser(user: User) {
        if (user.description == undefined) {
            user.description = '';
        }
        if (user.steam == undefined) {
            user.steam = '';
        }
        if (user.playstation == undefined) {
            user.playstation = '';
        }
        if (user.xbox == undefined) {
            user.xbox = '';
        }
        this.firestore.collection('/users').doc(user.id).set({
            id: user.id,
            name: user.name,
            description: user.description,
            email: user.email,
            signUpDate: user.parseDate(),
            steam: user.steam,
            playstation: user.playstation,
            xbox: user.xbox,
        });
    }

    getMessages(id: string) {
        return this.firestore.collection('/users').doc(id).collection('messages').valueChanges();
    }

    // Sends a message to the receiver user.
    sendMessage(senderId: string, receiverId: string, title: string, messageString: string) {
        const date = new Date();
        const message = new Message(title, messageString, senderId, receiverId, date);
        return this.firestore.collection('/users').doc(message.receiver).collection('/messages').doc(message.id).set({
            receiverId: message.receiver,
            senderId: message.sender,
            title: message.title,
            message: message.message,
            timeAndDate: message.parseDate(),
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
            title: message.title,
            message: message.message,
            timeAndDate: message.parseDate(),
            read: true,
        });
    }

    // Checks how many messages from logged user has not been red yet.
    numUnreadMessages(messages: any) {
        let numMessages = 0;
        for (const message of messages) {
            if (!message['read']) {
                numMessages++;
            }
        }
        return numMessages;
    }

    // Turns data into a Message object.
    dataToMessage(data: any) {
        const date = moment(data.timeAndDate, 'HH:mm:ss DD/MM/YYYY').toDate();
        return new Message(data.title, data.message, data.senderId, data.receiverId, date, data.read);
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

    // Shows a loading screen.
    async presentLoading(message: string) {
        const loading = await this.loadingController.create({
            cssClass: 'loading',
            message,
            duration: 500
        });
        await loading.present();
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
