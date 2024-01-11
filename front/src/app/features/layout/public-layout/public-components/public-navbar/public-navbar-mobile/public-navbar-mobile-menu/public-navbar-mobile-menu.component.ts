import { Component, OnInit } from '@angular/core';
import { PublicSubMenuItem } from '../../../../public-menu/model/public-menu.model';
import { PublicMenuService } from '../../../../public-menu/service/public-menu.service';
import { PublicNavbarMobileSubmenuComponent } from '../public-navbar-mobile-submenu/public-navbar-mobile-submenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-public-navbar-mobile-menu',
  templateUrl: './public-navbar-mobile-menu.component.html',
  styleUrls: ['./public-navbar-mobile-menu.component.scss'],
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    AngularSvgIconModule,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    PublicNavbarMobileSubmenuComponent,
  ],
  providers: [PublicMenuService],
})
export class PublicNavbarMobileMenuComponent implements OnInit {
  constructor(public menuService: PublicMenuService) {}

  public toggleMenu(subMenu: PublicSubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  public closeMenu() {
    this.menuService.showMobileMenu = false;
  }

  ngOnInit(): void {}
}


