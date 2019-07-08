import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { HomeModule } from './home/home.module';
import { IndexModule } from './index/index.module';

@NgModule({
  imports: [
    CommonModule,
    HomeModule,
    IndexModule,
    PagesRoutingModule,
  ]
})
export class PagesModule { }
