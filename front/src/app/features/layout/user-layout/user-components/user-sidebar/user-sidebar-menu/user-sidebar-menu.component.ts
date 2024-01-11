import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserSubMenuItem } from '../../../user-menu/model/user-menu.model';
import { UserMenuService } from '../../../user-menu/service/user-menu.service';
import { UserSidebarSubmenuComponent } from '../user-sidebar-submenu/user-sidebar-submenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-user-sidebar-menu',
  templateUrl: './user-sidebar-menu.component.html',
  styleUrls: ['./user-sidebar-menu.component.scss'],
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
    UserSidebarSubmenuComponent,
  ],
  providers: [UserMenuService],
})
export class UserSidebarMenuComponent implements OnInit {
  constructor(public menuService: UserMenuService) {}

  public toggleMenu(subMenu: UserSubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  ngOnInit(): void {}
}

