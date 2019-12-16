import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenusDropdownPage } from './menus-dropdown.page';

const routes: Routes = [
  {
    path: '',
    component: MenusDropdownPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenusDropdownPage]
})
export class MenusDropdownPageModule {}
