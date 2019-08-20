import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoadingComponent } from './loading.component';
import { LoadingDirective } from './loading.directive';

@NgModule({
  declarations: [LoadingComponent, LoadingDirective],
  imports: [
    CommonModule,
    NzSpinModule
  ],
  exports: [LoadingComponent, LoadingDirective],
  entryComponents: [LoadingComponent]
})
export class LoadingModule { }
