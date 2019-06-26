import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { DynamicComponent } from './dynamic/container/dynamic.component';
import { SearchFormComponent } from './search-form/search-form.component';

@NgModule({
  declarations: [
    DynamicComponent,
    SearchFormComponent,
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
  ],
  exports: [
    DynamicComponent,
    SearchFormComponent,
  ],
})
export class BaseComponentsModule {}
