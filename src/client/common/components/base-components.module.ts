import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { BasicModalComponent } from './basic-modal/basic-modal.component';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { SearchFormComponent } from './search-form/search-form.component';

@NgModule({
  declarations: [
    DynamicTableComponent,
    SearchFormComponent,
    BasicModalComponent,
    PageLayoutComponent
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
    NgZorroAntdModule
  ],
  exports: [
    DynamicTableComponent,
    SearchFormComponent,
    BasicModalComponent,
    PageLayoutComponent
  ]
})
export class BaseComponentsModule {}
