import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryFullPage } from './category-full.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryFullPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryFullPageRoutingModule {}
