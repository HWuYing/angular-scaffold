import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { UploadComponent } from './upload.component';

@NgModule({
  declarations: [UploadComponent],
  imports: [
    CommonModule,
    NzUploadModule,
    NzButtonModule
  ],
  exports: [ UploadComponent ]
})
export class UploadModule { }
