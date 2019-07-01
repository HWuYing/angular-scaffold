import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from './container/dynamic-form.component';

@NgModule({
  declarations: [DynamicFormComponent],
  imports: [
    CommonModule,
  ],
  providers: [ ],
  exports: [ DynamicFormComponent ],
})
export class DynamicFormModule { }
