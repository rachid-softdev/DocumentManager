import { Component, OnInit } from '@angular/core';
import { PublicMenuService } from '../../public-menu/service/public-menu.service';
import { PublicNavbarMobileComponent } from './public-navbar-mobile/public-navbar-mobilecomponent';
import { PublicProfileMenuComponent } from './public-profile-menu/public-profile-menu.component';
import { PublicNavbarMenuComponent } from './public-navbar-menu/public-navbar-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-public-navbar',
  templateUrl: './public-navbar.component.html',
  styleUrls: ['./public-navbar.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule, PublicNavbarMenuComponent, PublicProfileMenuComponent, PublicNavbarMobileComponent],
})
export class PublicNavbarComponent implements OnInit {
  constructor(private menuService: PublicMenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}


