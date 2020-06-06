import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScreenshotPageRoutingModule } from './screenshot-routing.module';

import { ScreenshotPage } from './screenshot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScreenshotPageRoutingModule
  ],
  declarations: [ScreenshotPage]
})
export class ScreenshotPageModule {}
