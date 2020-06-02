import {List} from './list.model';

export class User {
    constructor(id?: string, name?: string, email?: string, signUpDate?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.signUpDate = signUpDate;
        this.avatar = 'assets/img/default_avatar.jpg';
        this.banner = 'assets/img/default_banner.jpg';
    }

    id: string;
    name: string;
    description: string;
    email: string;
    signUpDate: string;
    avatar: string;
    banner: string;
    lists: List[];
}
