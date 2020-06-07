import {List} from './list.model';

export class User {
    id: string;
    name: string;
    description: string;
    email: string;
    signUpDate: string;
    avatar: string;
    banner: string;
    steam: string;
    playstation: string;
    xbox: string;
    lists: List[];

    constructor(id?: string, name?: string, email?: string, signUpDate?: string, steam?: string, playstation?: string, xbox?: string) {
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
}
