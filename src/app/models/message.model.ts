export class Message {
    id: string;
    title: string;
    message: string;
    sender: string;
    senderName: string;
    receiver: string;
    date: Date;
    read: boolean;

    constructor(title: string, message: string, sender: string, receiver: string, date: Date, read?: boolean) {
        this.title = title;
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.date = date;
        this.read = read;
        this.id = this.generateId();
    }

    parseDate(): string {
        const values = this.dateValues();
        return `${values.hours}:${values.minutes}:${values.seconds} ${values.day}/${values.month}/${values.year}`;
    }

    private generateId(): string {
        const values = this.dateValues();
        return `${values.hours}${values.minutes}${values.seconds}${values.day}${values.month}${values.year}`;
    }

    private dateValues() {
        const hours = this.twoDigits(this.date.getHours());
        const minutes = this.twoDigits(this.date.getMinutes());
        const seconds = this.twoDigits(this.date.getSeconds());
        const day = this.twoDigits(this.date.getDate());
        const month = this.twoDigits(this.date.getMonth() + 1);
        const year = this.date.getFullYear();
        return {hours, minutes, seconds, day, month, year};
    }

    private twoDigits(value: number): string {
        return ('0' + value).slice(-2);
    }
}
