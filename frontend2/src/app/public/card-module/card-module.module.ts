import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModuleComponent } from './card-module.component';

@NgModule({
  declarations: [CardModuleComponent],
  imports: [
    CommonModule
  ],
  exports: [CardModuleComponent]
})
export class CardModuleModule { }
