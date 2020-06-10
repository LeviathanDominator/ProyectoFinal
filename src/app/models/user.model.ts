import {List} from './list.model';

export class User {
    id: string;
    name: string;
    description: string;
    email: string;
    signUpDate: Date;
    avatar: string;
    banner: string;
    steam: string;
    playstation: string;
    xbox: string;
    lists: List[];

    constructor(id?: string, name?: string, email?: string, signUpDate?: Date, steam?: string, playstation?: string, xbox?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.signUpDate = signUpDate;
        this.avatar = 'assets/img/default_avatar.jpg';
        this.banner = 'assets/img/default_banner.jpg';
        this.steam = steam;
        this.playstation = playstation;
        this.xbox = xbox;
    }

    parseDate(): string {
        const day = this.twoDigits(this.signUpDate.getDate());
        const month = this.twoDigits(this.signUpDate.getMonth() + 1);
        const year = this.signUpDate.getFullYear();
        return `${day}/${month}/${year}`;
    }

    private twoDigits(value: number) {
        return ('0' + value).slice(-2);
    }
}
