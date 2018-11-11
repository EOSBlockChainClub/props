import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DefaultLayoutComponent} from './default-layout/default-layout.component';
import {MatSidenavModule} from '@angular/material';
import {NavbarModule} from '../features/navbar/navbar.module';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatSidenavModule,
    NavbarModule,
    RouterModule,
    FlexLayoutModule
  ],
  declarations: [
    DefaultLayoutComponent
  ],
  exports: [
    DefaultLayoutComponent
  ]
})
export class LayoutsModule { }
