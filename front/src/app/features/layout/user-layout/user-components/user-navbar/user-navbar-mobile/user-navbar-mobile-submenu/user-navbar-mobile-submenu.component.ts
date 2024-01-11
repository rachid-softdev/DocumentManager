import { Component, Input, OnInit } from '@angular/core';
import { UserMenuService } from '../../../../user-menu/service/user-menu.service';
import { UserSubMenuItem } from '../../../../user-menu/model/user-menu.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-user-navbar-mobile-submenu',
  templateUrl: './user-navbar-mobile-submenu.component.html',
  styleUrls: ['./user-navbar-mobile-submenu.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule],
  providers: [UserMenuService],
})
export class UserNavbarMobileSubmenuComponent implements OnInit {
  @Input() public submenu = <UserSubMenuItem>{};

  constructor(private menuService: UserMenuService) {}

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

