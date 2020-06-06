import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';

@Component({
    selector: 'app-screenshot',
    templateUrl: './screenshot.page.html',
    styleUrls: ['./screenshot.page.scss'],
})
export class ScreenshotPage implements OnInit {

    private title = '';
    private screenshot = '';

    constructor(private navParams: NavParams, private modalController: ModalController) {
        this.title = this.navParams.get('title');
        this.screenshot = this.navParams.get('screenshot');
    }

    ngOnInit() {
    }

    close() {
        this.modalController.dismiss({
            dismissed: true
        });
    }
}
