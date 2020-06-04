export class Message {
    id: string;
    message: string;
    sender: string;
    senderName: string;
    receiver: string;
    date: string;
    read: boolean;

    constructor(message: string, sender: string, receiver: string, date: string, read?: boolean) {
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.date = date;
        this.read = read;
        this.id = date.split(':').join('').split(' ').join('').split('/').join('');
    }
}
