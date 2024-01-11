import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthenticationGuard } from '../../core/guards/authentication-guard';

const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthenticationGuard],
    data: {
      role: 'ADMINISTRATOR',
    },
    loadChildren: () => import('./admin-layout/admin-layout.module').then((m) => m.AdminLayoutModule),
  },
  {
    path: 'user',
    component: LayoutComponent,
    canActivate: [AuthenticationGuard],
    data: {
      role: 'USER',
    },
    loadChildren: () => import('./user-layout/user-layout.module').then((m) => m.UserLayoutModule),
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('./public-layout/public-layout.module').then((m) => m.PublicLayoutModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
