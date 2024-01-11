import { Component, Input, OnInit } from '@angular/core';
import { AdminSubMenuItem } from '../../../admin-menu/model/admin-menu.model';
import { AdminMenuService } from '../../../admin-menu/service/admin-menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar-submenu',
  templateUrl: './admin-sidebar-submenu.component.html',
  styleUrls: ['./admin-sidebar-submenu.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule],
  providers: [AdminMenuService],
})
export class AdminSidebarSubmenuComponent implements OnInit {
  @Input() public submenu = <AdminSubMenuItem>{};

  constructor(public menuService: AdminMenuService) {}

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
}
