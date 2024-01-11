import { Component, OnInit } from '@angular/core';
import { AdminSubMenuItem } from '../../../../admin-menu/model/admin-menu.model';
import { AdminMenuService } from '../../../../admin-menu/service/admin-menu.service';
import { AdminNavbarMobileSubmenuComponent } from '../admin-navbar-mobile-submenu/admin-navbar-mobile-submenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-navbar-mobile-menu',
  templateUrl: './admin-navbar-mobile-menu.component.html',
  styleUrls: ['./admin-navbar-mobile-menu.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    AngularSvgIconModule,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    AdminNavbarMobileSubmenuComponent,
  ],
  providers: [AdminMenuService],
})
export class AdminNavbarMobileMenuComponent implements OnInit {
  constructor(public menuService: AdminMenuService) {}

  public toggleMenu(subMenu: AdminSubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  public closeMenu() {
    this.menuService.showMobileMenu = false;
  }

  ngOnInit(): void {}
}
