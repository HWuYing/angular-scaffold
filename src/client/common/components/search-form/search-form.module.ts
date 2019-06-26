import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { SearchFormComponent } from './search-form.component';
import { DynamicModule } from '../dynamic/dynamic.module';

@NgModule({
  declarations: [SearchFormComponent],
  imports: [
    CommonModule,
    DynamicModule,
    NgZorroAntdModule,
  ],
  exports: [
    SearchFormComponent,
  ],
})
export class SearchFormModule { }
