import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { BasicModalComponent } from './basic-modal/basic-modal.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { DynamicFormComponent } from './dynamic-form/container/dynamic-form.component';
import { SearchFormComponent } from './search-form/search-form.component';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicTableComponent,
    SearchFormComponent,
    BasicModalComponent,
    PageLayoutComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  exports: [
    DynamicFormComponent,
    DynamicTableComponent,
    SearchFormComponent,
    BasicModalComponent,
    PageLayoutComponent,
  ],
})
export class BaseComponentsModule {}
