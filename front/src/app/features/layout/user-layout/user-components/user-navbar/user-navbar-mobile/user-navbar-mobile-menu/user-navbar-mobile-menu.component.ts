import { Component, OnInit } from '@angular/core';
import { UserSubMenuItem } from '../../../../user-menu/model/user-menu.model';
import { UserMenuService } from '../../../../user-menu/service/user-menu.service';
import { UserNavbarMobileSubmenuComponent } from '../user-navbar-mobile-submenu/user-navbar-mobile-submenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-navbar-mobile-menu',
  templateUrl: './user-navbar-mobile-menu.component.html',
  styleUrls: ['./user-navbar-mobile-menu.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    AngularSvgIconModule,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    UserNavbarMobileSubmenuComponent,
  ],
  providers: [UserMenuService],
})
export class UserNavbarMobileMenuComponent implements OnInit {
  constructor(public menuService: UserMenuService) {}

  public toggleMenu(subMenu: UserSubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  public closeMenu() {
    this.menuService.showMobileMenu = false;
  }

  ngOnInit(): void {}
}

