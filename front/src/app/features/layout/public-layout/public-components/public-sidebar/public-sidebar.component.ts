import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import packageJson from '../../../../../../../package.json';
import { PublicMenuService } from '../../public-menu/service/public-menu.service';
import { PublicSidebarMenuComponent } from './public-sidebar-menu/public-sidebar-menu.component';

@Component({
  selector: 'app-public-sidebar',
  templateUrl: './public-sidebar.component.html',
  styleUrls: ['./public-sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, AngularSvgIconModule, PublicSidebarMenuComponent, RouterLink],
  providers: [PublicMenuService],
})
export class PublicSidebarComponent implements OnInit {
  private _appJson: any = packageJson;

  constructor(public themeService: ThemeService, public menuService: PublicMenuService) {}

  ngOnInit(): void {}

  public get getAppJson(): any {
    return this._appJson;
  }

  public toggleSidebar(): void {
    this.menuService.toggleSidebar();
  }

  public toggleTheme(): void {
    this.themeService.theme = !this.themeService.isDark ? 'dark' : 'light';
  }
}


