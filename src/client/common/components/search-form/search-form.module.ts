import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SearchFormComponent } from './search-form.component';

@NgModule({
  declarations: [
    SearchFormComponent,
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
    NzButtonModule,
  ],
  exports: [
    SearchFormComponent,
  ],
})
export class SearchFormModule { }
