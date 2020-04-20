import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageUserRoutingModule } from './page-user-routing.module';
import { UserAddComponent } from './user-add/user-add.component';


@NgModule({
  declarations: [UserAddComponent],
  imports: [
    CommonModule,
    PageUserRoutingModule
  ]
})
export class PageUserModule { }
