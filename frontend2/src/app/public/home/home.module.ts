import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import {HomeRouter} from './home.routing';
import { CardModuleModule } from '../card-module/card-module.module';
import { MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    HomeRouter,
    RouterModule,
    CommonModule,
    MatButtonModule,
    CardModuleModule
  ]
})
export class HomeModule { }
