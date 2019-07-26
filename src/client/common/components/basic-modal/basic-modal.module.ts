import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { BasicModalComponent } from './basic-modal.component';

@NgModule({
  declarations: [ BasicModalComponent ],
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    TranslateModule
  ],
  exports: [
    BasicModalComponent
  ]
})
export class BasicModalModule { }
