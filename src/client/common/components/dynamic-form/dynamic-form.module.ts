import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormComponent } from './enquire/dynamic-form.component';

@NgModule({
  declarations: [DynamicFormComponent],
  imports: [
    CommonModule
  ],
  providers: [ ],
  exports: [ DynamicFormComponent ]
})
export class DynamicFormModule { }
