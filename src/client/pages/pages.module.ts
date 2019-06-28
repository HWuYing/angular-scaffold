import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { BaseComponentsModule } from '../common/components/base-components.module';
import { HomeComponent } from './home/container/home.component';

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    BaseComponentsModule,
    PagesRoutingModule,
  ]
})
export class PagesModule { }
