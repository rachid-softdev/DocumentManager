import { Component, Input, OnInit } from '@angular/core';
import { PublicMenuService } from '../../../../public-menu/service/public-menu.service';
import { PublicSubMenuItem } from '../../../../public-menu/model/public-menu.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-public-navbar-mobile-submenu',
  templateUrl: './public-navbar-mobile-submenu.component.html',
  styleUrls: ['./public-navbar-mobile-submenu.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule],
  providers: [PublicMenuService],
})
export class PublicNavbarMobileSubmenuComponent implements OnInit {
  @Input() public submenu = <PublicSubMenuItem>{};

  constructor(private menuService: PublicMenuService) {}

  ngOnInit(): void {}

  public toggleMenu(menu: any) {
    this.menuService.toggleSubMenu(menu);
  }

  private collapse(items: Array<any>) {
    items.forEach((item) => {
      item.expanded = false;
      if (item.children) this.collapse(item.children);
    });
  }

  public closeMobileMenu() {
    this.menuService.showMobileMenu = false;
  }
}


