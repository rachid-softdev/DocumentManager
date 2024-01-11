import { Component, Input, OnInit } from '@angular/core';
import { AdminMenuService } from '../../../../admin-menu/service/admin-menu.service';
import { AdminSubMenuItem } from '../../../../admin-menu/model/admin-menu.model';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-admin-navbar-mobile-submenu',
  templateUrl: './admin-navbar-mobile-submenu.component.html',
  styleUrls: ['./admin-navbar-mobile-submenu.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule],
  providers: [AdminMenuService],
})
export class AdminNavbarMobileSubmenuComponent implements OnInit {
  @Input() public submenu = <AdminSubMenuItem>{};

  constructor(private menuService: AdminMenuService) {}

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
