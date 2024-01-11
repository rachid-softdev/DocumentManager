import { Component, Input, OnInit } from '@angular/core';
import { PublicSubMenuItem } from '../../../public-menu/model/public-menu.model';
import { PublicMenuService } from '../../../public-menu/service/public-menu.service';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-public-sidebar-submenu',
  templateUrl: './public-sidebar-submenu.component.html',
  styleUrls: ['./public-sidebar-submenu.component.scss'],
  standalone: true,
  imports: [NgClass, NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, AngularSvgIconModule],
  providers: [PublicMenuService],
})
export class PublicSidebarSubmenuComponent implements OnInit {
  @Input() public submenu = <PublicSubMenuItem>{};

  constructor(public menuService: PublicMenuService) {}

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


