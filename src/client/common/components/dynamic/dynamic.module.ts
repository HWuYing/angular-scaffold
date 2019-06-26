import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DynamicComponent } from './dynamic.component';

@NgModule({
  declarations: [
    DynamicComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  exports: [
    DynamicComponent,
  ],
})
export class DynamicModule { }
