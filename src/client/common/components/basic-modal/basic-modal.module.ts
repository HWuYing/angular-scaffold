import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { BasicModalComponent } from './basic-modal.component';

@NgModule({
  declarations: [ BasicModalComponent ],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
  ],
  exports: [
    BasicModalComponent,
  ],
})
export class BasicModalModule { }
