import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryFullPageRoutingModule } from './category-full-routing.module';

import { CategoryFullPage } from './category-full.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryFullPageRoutingModule
  ],
  declarations: [CategoryFullPage]
})
export class CategoryFullPageModule {}
