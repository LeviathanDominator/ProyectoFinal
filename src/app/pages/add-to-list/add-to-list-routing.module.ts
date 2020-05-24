import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddToListPage } from './add-to-list.page';

const routes: Routes = [
  {
    path: '',
    component: AddToListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddToListPageRoutingModule {}
