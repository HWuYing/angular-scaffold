import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DynamicFormComponent } from './container/dynamic-form.component';
import { DYNAMIC_COMPILER_PROVIDER } from './providers/dynamic-compiler-provider';


@NgModule({
  declarations: [DynamicFormComponent],
  imports: [
    CommonModule
  ],
  providers: [...DYNAMIC_COMPILER_PROVIDER],
  exports: [ DynamicFormComponent ],
})
export class DynamicFormModule { }
