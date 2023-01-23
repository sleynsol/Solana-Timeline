import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DirectMessagePage } from '../direct-message/direct-message.page';
import { HomePageModule } from '../home/home.module';
import { HomePage } from '../home/home.page';
import { ProfilePageModule } from '../profile/profile.module';
import { ProfilePage } from '../profile/profile.page';
import { SearchPageModule } from '../search/search.module';
import { SearchPage } from '../search/search.page';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', component: HomePage, pathMatch: 'full' },
      { path: 'search', component: SearchPage, pathMatch: 'full' },
      { path: 'profile', component: ProfilePage, pathMatch: 'full' },
      { path: 'dm', component: DirectMessagePage, pathMatch: 'full' },
      {
        path: '',
        redirectTo: '/tabs/profile',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/profile',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

  ],
})
export class TabsPageRoutingModule {}
