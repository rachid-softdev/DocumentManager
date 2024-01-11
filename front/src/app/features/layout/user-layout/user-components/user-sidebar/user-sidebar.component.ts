import { NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ThemeService } from '../../../../../core/services/theme.service';
import packageJson from '../../../../../../../package.json';
import { UserMenuService } from '../../user-menu/service/user-menu.service';
import { UserSidebarMenuComponent } from './user-sidebar-menu/user-sidebar-menu.component';
import { AuthenticationService } from '../../../../../core/services/authentication/authentication.service';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.scss'],
  standalone: true,
  imports: [NgClass, NgIf, AngularSvgIconModule, SharedModule, TranslateModule, UserSidebarMenuComponent, RouterLink],
  providers: [UserMenuService, AuthenticationService],
})
export class UserSidebarComponent implements OnInit {
  private _appJson: any = packageJson;

  constructor(
    public themeService: ThemeService,
    public menuService: UserMenuService,
    private _authenticationService: AuthenticationService,
  ) {}

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
