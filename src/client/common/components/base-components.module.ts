import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BasicModalModule } from './basic-modal/basic-modal.module';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { DynamicTableModule } from './dynamic-table/dynamic-table.module';
import { EditTableModule } from './edit-table/edit-table.module';
import { LoadingModule } from './loading/loading.module';
import { PageLayoutModule } from './page-layout/page-layout.module';
import { SearchFormModule } from './search-form/search-form.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    SearchFormModule,
    PageLayoutModule,
    DynamicFormModule,
    EditTableModule,
    BasicModalModule,
    DynamicTableModule,
    LoadingModule
  ]
})
export class BaseComponentsModule {}
