import { Component, OnInit } from '@angular/core';
import { UserMenuService } from '../../user-menu/service/user-menu.service';
import { UserNavbarMobileComponent } from './user-navbar-mobile/user-navbar-mobilecomponent';
import { UserProfileMenuComponent } from './user-profile-menu/user-profile-menu.component';
import { UserNavbarMenuComponent } from './user-navbar-menu/user-navbar-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule, UserNavbarMenuComponent, UserProfileMenuComponent, UserNavbarMobileComponent],
})
export class UserNavbarComponent implements OnInit {
  constructor(private menuService: UserMenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}

