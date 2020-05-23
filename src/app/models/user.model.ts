import {List} from './list.model';

export class User {
    constructor(id?: string, name?: string, email?: string, signUpDate?: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.signUpDate = signUpDate;
    }
    id: string;
    name: string;
    email: string;
    signUpDate: string;
    lists: List[];
}
