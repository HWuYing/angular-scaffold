import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{
  path: '',
  pathMatch: 'prefix',
  redirectTo: 'home',
}, {
  path: 'home',
  loadChildren: '../pages/pages.module#PagesModule',
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
