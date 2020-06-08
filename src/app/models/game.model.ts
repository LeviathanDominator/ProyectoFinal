import {Label} from './label.model';
import {Platform} from './platform.model';
import {Store} from './store.model';

export class Game {
    id: number;
    title: string;
    description: string;
    dlcDescription: string;
    avgCompletion: number[];
    image: string;
    released: string;
    screenshots: string[];
    esrb: string;
    platforms: Platform[];
    labels: Label[];
    ratings: number;
    developers: string;
    stores: Store[];
    show: boolean;

    constructor(id: number, title: string, description?: string, image?: string, released?: string, screenshots?: string[], esrb?: string,
                developers?: any, ratings?: number, stores?: any) {
        this.id = id;
        this.title = title;
        this.description = description ? description : '';
        this.image = image;
        this.released = released ? released : 'No date of release';
        this.screenshots = screenshots;
        this.esrb = esrb ? esrb : 'None';
        this.platforms = [];
        this.labels = [];
        this.ratings = ratings;
        this.developers = this.getDevelopers(developers);
        this.stores = this.getStores(stores);
        this.show = true;
    }


    private getStores(storeData: any) {
        if (!storeData) {
            return undefined;
        }
        const stores: Store[] = [];
        for (const store of storeData) {
            stores.push(new Store(store.store.name, store.url));
        }
        return stores;
    }

    private getDevelopers(developersData: any) {
        if (!developersData) {
            return undefined;
        }
        let developers = '';
        for (let i = 0; i < developersData.length; i++) {
            developers = developers.concat(developersData[i].name);
            if (i + 1 < developersData.length - 1) {
                developers = developers.concat(', ');
                // tslint:disable-next-line:triple-equals
            } else if (i + 1 == developersData.length - 1) {
                developers = developers.concat(' and ');
            }
        }
        return developers;
    }
}
