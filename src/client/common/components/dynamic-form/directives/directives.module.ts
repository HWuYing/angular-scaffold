import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DisableDirective } from './disable.directive';

@NgModule({
  declarations: [
    DisableDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DisableDirective
  ]
})
export class DirectivesModule { }
