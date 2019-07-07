import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PageLayoutModule } from '../common/components/page-layout/page-layout.module';
import { HomeComponent } from './home/container/home.component';

@NgModule({
  declarations: [ HomeComponent ],
  imports: [
    CommonModule,
    PageLayoutModule,
    PagesRoutingModule,
  ]
})
export class PagesModule { }
