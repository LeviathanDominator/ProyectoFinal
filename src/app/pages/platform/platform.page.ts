import { Component, OnInit } from '@angular/core';
import {Platform} from "../../models/platform.model";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-platform',
  templateUrl: './platform.page.html',
  styleUrls: ['./platform.page.scss'],
})
export class PlatformPage implements OnInit {

  platform: Platform;

  constructor(private activatedRoute: ActivatedRoute, private _apiService: ApiService) {
    this.activatedRoute.params.subscribe(params => {
    _apiService.getPlatform(params['id']).subscribe(platform => {
      this.platform = _apiService.dataToPlatform(platform);
      console.log(platform);
    })});
  }

  ngOnInit() {
  }

}
