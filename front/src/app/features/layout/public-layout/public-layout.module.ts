import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicLayoutRoutingModule } from './public-layout-routing.module';
import { PublicLayoutComponent } from '../public-layout/public-layout.component';
import { PublicSidebarComponent } from './public-components/public-sidebar/public-sidebar.component';
import { PublicBottomNavbarComponent } from './public-components/public-bottom-navbar/public-bottom-navbar.component';

@NgModule({
  declarations: [PublicLayoutComponent],
  imports: [CommonModule, PublicLayoutRoutingModule, PublicSidebarComponent, PublicBottomNavbarComponent],
  exports: [PublicLayoutComponent],
})
export class PublicLayoutModule {}


