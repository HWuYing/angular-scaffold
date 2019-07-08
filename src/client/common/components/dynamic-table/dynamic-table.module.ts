import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { DynamicTableComponent } from './dynamic-table.component';

@NgModule({
  declarations: [ DynamicTableComponent ],
  imports: [
    CommonModule,
    NzTableModule
  ],
  exports: [ DynamicTableComponent ]
})
export class DynamicTableModule { }
