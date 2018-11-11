import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SentPropsComponent } from './sent-props.component';
import { SentPropsRoutes } from './sent-props.routing';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatTableModule} from '@angular/material';
import {TimeAgoModule} from '../shared/time-ago/time-ago.module';

@NgModule({
  declarations: [SentPropsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTableModule,
    SentPropsRoutes,
    TimeAgoModule
  ]
})
export class SentPropsModule { }
