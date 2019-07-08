import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DynamicTableModule } from '../dynamic-table/dynamic-table.module';
import { SearchFormModule } from '../search-form/search-form.module';
import { PageLayoutComponent } from './page-layout.component';

@NgModule({
  declarations: [
    PageLayoutComponent
  ],
  imports: [
    CommonModule,
    DynamicTableModule,
    SearchFormModule,
    NzButtonModule
  ],
  exports: [
    PageLayoutComponent
  ]
})
export class PageLayoutModule { }
