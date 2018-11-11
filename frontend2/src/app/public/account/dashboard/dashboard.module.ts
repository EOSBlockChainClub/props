import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import {DashboardRoutes} from './dashboard.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material';
import {TimeAgoPipe} from 'time-ago-pipe';
import { TimeAgoModule } from '../shared/time-ago/time-ago.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutes,
    FlexLayoutModule,
    MatTableModule,
    TimeAgoModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
