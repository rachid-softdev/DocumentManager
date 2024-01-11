import { Component, OnInit } from '@angular/core';
import { AdminMenuService } from '../../admin-menu/service/admin-menu.service';
import { AdminNavbarMobileComponent } from './admin-navbar-mobile/admin-navbar-mobilecomponent';
import { AdminProfileMenuComponent } from './admin-profile-menu/admin-profile-menu.component';
import { AdminNavbarMenuComponent } from './admin-navbar-menu/admin-navbar-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule, AdminNavbarMenuComponent, AdminProfileMenuComponent, AdminNavbarMobileComponent],
})
export class AdminNavbarComponent implements OnInit {
  constructor(private menuService: AdminMenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}
