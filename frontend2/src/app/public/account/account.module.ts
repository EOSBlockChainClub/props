import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AccountRouting } from './account.routing';
import { MatSidenavModule } from '@angular/material';
import {RouterModule} from '@angular/router';
import { NavbarModule } from './shared/navbar/navbar.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterModule,
    AccountRouting,
    NavbarModule
  ]
})
export class AccountModule { }
