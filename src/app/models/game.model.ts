import {Label} from './label.model';
import {Platform} from './platform.model';
import {Store} from './store.model';
import {Movie} from './movie.model';

export class Game {
    id: number;
    title: string;
    description: string;
    dlcDescription: string;
    avgCompletion: number[];
    image: string;
    released: Date;
    screenshots: string[];
    movies: Movie[];
    esrb: string;
    platforms: Platform[];
    labels: Label[];
    ratings: number;
    developers: string;
    stores: Store[];
    show: boolean;

    constructor(id: number, title: string, description?: string, image?: string, released?: Date, screenshots?: string[], esrb?: string,
                developers?: any, ratings?: number, stores?: any) {
        this.id = id;
        this.title = title;
        this.description = description ? description : '';
        this.image = image;
        this.released = released;
        this.screenshots = screenshots;
        this.esrb = esrb ? esrb : 'None';
        this.platforms = [];
        this.labels = [];
        this.ratings = ratings;
        this.developers = this.getDevelopers(developers);
        this.stores = this.getStores(stores);
        this.show = true;
    }


    private getStores(storeData: any): undefined | Store[] {
        if (!storeData) {
            return undefined;
        }
        const stores: Store[] = [];
        for (const store of storeData) {
            stores.push(new Store(store.store.name, store.url));
        }
        return stores;
    }

    private getDevelopers(devData: any): string | undefined {
        if (!devData) {
            return undefined;
        }
        let developers = '';
        for (let i = 0; i < devData.length; i++) {
            developers = developers.concat(devData[i].name);
            if (i + 1 < devData.length - 1) {
                developers = developers.concat(', ');
                // tslint:disable-next-line:triple-equals
            } else if (i + 1 == devData.length - 1) {
                developers = developers.concat(' and ');
            }
        }
        return developers;
    }

    parseDate(): string {
        if (isNaN(this.released.getDay()) || isNaN(this.released.getMonth()) || isNaN(this.released.getFullYear())) {
            return 'No release date';
        } else {
            const day = this.twoDigits(this.released.getDate());
            const month = this.twoDigits(this.released.getMonth() + 1);
            const year = this.released.getFullYear();
            return `${day}/${month}/${year}`;
        }
    }

    private twoDigits(value: number): string {
        return ('0' + value).slice(-2);
    }
}
