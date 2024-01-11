import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from '../admin-layout/admin-layout.component';
import { AdminSidebarComponent } from './admin-components/admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './admin-components/admin-navbar/admin-navbar.component';
import { AdminBottomNavbarComponent } from './admin-components/admin-bottom-navbar/admin-bottom-navbar.component';

@NgModule({
  declarations: [AdminLayoutComponent],
  imports: [CommonModule, AdminLayoutRoutingModule, AdminSidebarComponent, AdminNavbarComponent,  AdminBottomNavbarComponent],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule {}
