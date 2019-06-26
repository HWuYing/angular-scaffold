import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicModule } from './dynamic/dynamic.module';
import { SearchFormModule } from './search-form/search-form.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DynamicModule,
    SearchFormModule,
  ],
  exports: [
    DynamicModule,
    SearchFormModule,
  ],
})
export class BaseComponentsModule {}
