import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { TableSpanDirective } from './directives/table-span.directive';
import { DynamicTableComponent } from './dynamic-table.component';

@NgModule({
  declarations: [ DynamicTableComponent, TableSpanDirective ],
  imports: [
    CommonModule,
    NzTableModule
  ],
  exports: [ DynamicTableComponent ]
})
export class DynamicTableModule { }
