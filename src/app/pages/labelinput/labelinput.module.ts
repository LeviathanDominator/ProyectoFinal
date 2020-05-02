import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LabelinputPageRoutingModule } from './labelinput-routing.module';

import { LabelinputPage } from './labelinput.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LabelinputPageRoutingModule
  ],
  declarations: [LabelinputPage]
})
export class LabelinputPageModule {}
