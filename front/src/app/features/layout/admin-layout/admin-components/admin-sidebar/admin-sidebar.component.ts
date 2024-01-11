import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../../../core/services/theme.service';
import packageJson from '../../../../../../../package.json';
import { AdminMenuService } from '../../admin-menu/service/admin-menu.service';
import { AdminSidebarMenuComponent } from './admin-sidebar-menu/admin-sidebar-menu.component';
import { AuthenticationService } from '../../../../../core/services/authentication/authentication.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, AngularSvgIconModule, TranslateModule, AdminSidebarMenuComponent, RouterLink],
  providers: [AdminMenuService, AuthenticationService],
})
export class AdminSidebarComponent implements OnInit {
  private _appJson: any = packageJson;

  constructor(public themeService: ThemeService, public menuService: AdminMenuService, private _authenticationService: AuthenticationService) {}

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

  public logout(): void {
    this._authenticationService.logout();
  }
}
