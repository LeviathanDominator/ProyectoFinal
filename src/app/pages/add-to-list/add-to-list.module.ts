import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddToListPageRoutingModule } from './add-to-list-routing.module';

import { AddToListPage } from './add-to-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddToListPageRoutingModule
  ],
  declarations: [AddToListPage]
})
export class AddToListPageModule {}
