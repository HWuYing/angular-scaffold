import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';
import { SearchFormComponent } from './search-form.component';

@NgModule({
  declarations: [
    SearchFormComponent
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
    NzButtonModule,
    NzCollapseModule
  ],
  exports: [
    SearchFormComponent
  ]
})
export class SearchFormModule { }
