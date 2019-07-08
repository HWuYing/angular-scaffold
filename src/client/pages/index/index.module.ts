import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutModule } from '../../common/components/page-layout/page-layout.module';
import { IndexComponent } from './container/index.component';

@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    PageLayoutModule,
  ],
})
export class IndexModule { }
