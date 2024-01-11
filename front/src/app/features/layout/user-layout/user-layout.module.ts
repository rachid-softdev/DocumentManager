import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserLayoutRoutingModule } from './user-layout-routing.module';
import { UserLayoutComponent } from '../user-layout/user-layout.component';
import { UserSidebarComponent } from './user-components/user-sidebar/user-sidebar.component';
import { UserBottomNavbarComponent } from './user-components/user-bottom-navbar/user-bottom-navbar.component';
import { UserNavbarComponent } from './user-components/user-navbar/user-navbar.component';
import { UserFooterComponent } from './user-components/user-footer/user-footer.component';

@NgModule({
  declarations: [UserLayoutComponent],
  imports: [CommonModule, TranslateModule, UserLayoutRoutingModule, UserSidebarComponent, UserNavbarComponent, UserFooterComponent, UserBottomNavbarComponent],
  exports: [UserLayoutComponent],
})
export class UserLayoutModule {}

