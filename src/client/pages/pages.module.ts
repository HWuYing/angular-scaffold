import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { PagesRoutingModule } from './pages-routing.module';
import { BaseComponentsModule } from '../common/components/base-components.module';
import { HomeComponent } from './home/container/home.component';

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    BaseComponentsModule,
    NgZorroAntdModule,
    PagesRoutingModule,
  ]
})
export class PagesModule { }
