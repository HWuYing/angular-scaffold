import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageLayoutModule } from '../../common/components/page-layout/page-layout.module';
import { HomeComponent } from './container/home.component';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    PageLayoutModule,
  ],
})
export class HomeModule { }
