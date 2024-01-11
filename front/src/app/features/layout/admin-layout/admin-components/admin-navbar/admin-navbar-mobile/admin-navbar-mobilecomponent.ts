import { Component, OnInit } from '@angular/core';
import { AdminMenuService } from '../../../admin-menu/service/admin-menu.service';
import { AdminNavbarMobileMenuComponent } from './admin-navbar-mobile-menu/admin-navbar-mobile-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-admin-navbar-mobile',
    templateUrl: './admin-navbar-mobile.component.html',
    styleUrls: ['./admin-navbar-mobile.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        AngularSvgIconModule,
        AdminNavbarMobileMenuComponent,
    ],
    providers: [AdminMenuService]
})
export class AdminNavbarMobileComponent implements OnInit {
  constructor(public menuService: AdminMenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}
