import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/container/home.component';
import { IndexComponent } from './index/container/index.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
}, {
  path: 'index',
  component: IndexComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
