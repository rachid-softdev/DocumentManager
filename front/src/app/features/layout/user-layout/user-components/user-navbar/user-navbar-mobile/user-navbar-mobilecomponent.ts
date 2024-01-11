import { Component, OnInit } from '@angular/core';
import { UserMenuService } from '../../../user-menu/service/user-menu.service';
import { UserNavbarMobileMenuComponent } from './user-navbar-mobile-menu/user-navbar-mobile-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-user-navbar-mobile',
    templateUrl: './user-navbar-mobile.component.html',
    styleUrls: ['./user-navbar-mobile.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        AngularSvgIconModule,
        UserNavbarMobileMenuComponent,
    ],
    providers: [UserMenuService]
})
export class UserNavbarMobileComponent implements OnInit {
  constructor(public menuService: UserMenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}

