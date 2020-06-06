import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScreenshotPage } from './screenshot.page';

const routes: Routes = [
  {
    path: '',
    component: ScreenshotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScreenshotPageRoutingModule {}
