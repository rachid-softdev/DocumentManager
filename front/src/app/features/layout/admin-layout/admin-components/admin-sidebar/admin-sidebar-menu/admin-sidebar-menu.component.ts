import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdminSubMenuItem } from '../../../admin-menu/model/admin-menu.model';
import { AdminMenuService } from '../../../admin-menu/service/admin-menu.service';
import { AdminSidebarSubmenuComponent } from '../admin-sidebar-submenu/admin-sidebar-submenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar-menu',
  templateUrl: './admin-sidebar-menu.component.html',
  styleUrls: ['./admin-sidebar-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgFor,
    NgClass,
    AngularSvgIconModule,
    NgTemplateOutlet,
    RouterLink,
    RouterLinkActive,
    NgIf,
    AdminSidebarSubmenuComponent,
  ],
  providers: [AdminMenuService],
})
export class AdminSidebarMenuComponent implements OnInit {
  constructor(public menuService: AdminMenuService) {}

  public toggleMenu(subMenu: AdminSubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  ngOnInit(): void {}
}
