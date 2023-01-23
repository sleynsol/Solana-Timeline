import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { HomePageModule } from '../home/home.module';
import { SearchPageModule } from '../search/search.module';
import { ProfilePageModule } from '../profile/profile.module';
import { DirectMessagePageModule } from '../direct-message/direct-message.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    ComponentsModule,
    HomePageModule,
    SearchPageModule,
    ProfilePageModule,
    DirectMessagePageModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
