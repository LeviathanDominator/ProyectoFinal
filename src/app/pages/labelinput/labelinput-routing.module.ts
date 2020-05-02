import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LabelinputPage } from './labelinput.page';

const routes: Routes = [
  {
    path: '',
    component: LabelinputPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelinputPageRoutingModule {}
