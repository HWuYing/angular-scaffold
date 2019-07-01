import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { BasicModalComponent } from './basic-modal/basic-modal.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';

@NgModule({
  declarations: [
    DynamicTableComponent,
    SearchFormComponent,
    BasicModalComponent,
    PageLayoutComponent,
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
    NgZorroAntdModule,
  ],
  exports: [
    DynamicTableComponent,
    SearchFormComponent,
    BasicModalComponent,
    PageLayoutComponent,
  ],
})
export class BaseComponentsModule {}
