import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PublicSubMenuItem } from '../../../public-menu/model/public-menu.model';
import { PublicMenuService } from '../../../public-menu/service/public-menu.service';
import { PublicSidebarSubmenuComponent } from '../public-sidebar-submenu/public-sidebar-submenu.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgFor, NgClass, NgTemplateOutlet, NgIf } from '@angular/common';

@Component({
  selector: 'app-public-sidebar-menu',
  templateUrl: './public-sidebar-menu.component.html',
  styleUrls: ['./public-sidebar-menu.component.scss'],
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
    PublicSidebarSubmenuComponent,
  ],
  providers: [PublicMenuService],
})
export class PublicSidebarMenuComponent implements OnInit {
  constructor(public menuService: PublicMenuService) {}

  public toggleMenu(subMenu: PublicSubMenuItem) {
    this.menuService.toggleMenu(subMenu);
  }

  ngOnInit(): void {}
}


