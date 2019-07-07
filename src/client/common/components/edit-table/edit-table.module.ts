import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableModule } from '../dynamic-table/dynamic-table.module';
import { DynamicFormModule } from '../dynamic-form/dynamic-form.module';

import { EditTableComponent } from './edit-table.component';

@NgModule({
  declarations: [
    EditTableComponent,
  ],
  imports: [
    CommonModule,
    DynamicTableModule,
    DynamicFormModule,
  ],
  exports: [
    EditTableComponent,
  ],
})
export class EditTableModule { }
