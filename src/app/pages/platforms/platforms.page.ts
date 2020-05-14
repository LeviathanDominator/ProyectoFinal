import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Platform} from 'src/app/models/platform.model';

@Component({
    selector: 'app-platforms',
    templateUrl: './platforms.page.html',
    styleUrls: ['./platforms.page.scss'],
})
export class PlatformsPage implements OnInit {

    platforms: Platform[];

    constructor(private _apiService: ApiService) {
        _apiService.getPlatforms().subscribe(platforms => {
            this.platforms = [];
            for (let platform of platforms['results']) {
                this.platforms.push(_apiService.dataToPlatform(platform));
            }
        });
    }

    ngOnInit() {
    }

    goToPlatform(id: number) {
        this._apiService.goToPlatform(id)
    }
}
