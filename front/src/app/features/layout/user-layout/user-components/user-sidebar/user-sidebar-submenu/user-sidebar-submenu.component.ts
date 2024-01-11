import { Component, Input, OnInit } from '@angular/core';
import { UserSubMenuItem } from '../../../user-menu/model/user-menu.model';
import { UserMenuService } from '../../../user-menu/service/user-menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-user-sidebar-submenu',
  templateUrl: './user-sidebar-submenu.component.html',
  styleUrls: ['./user-sidebar-submenu.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule],
  providers: [UserMenuService],
})
export class UserSidebarSubmenuComponent implements OnInit {
  @Input() public submenu = <UserSubMenuItem>{};

  constructor(public menuService: UserMenuService) {}

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

