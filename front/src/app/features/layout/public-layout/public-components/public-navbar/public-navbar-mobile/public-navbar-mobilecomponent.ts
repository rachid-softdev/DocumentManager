import { Component, OnInit } from '@angular/core';
import { PublicMenuService } from '../../../public-menu/service/public-menu.service';
import { PublicNavbarMobileMenuComponent } from './public-navbar-mobile-menu/public-navbar-mobile-menu.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-public-navbar-mobile',
    templateUrl: './public-navbar-mobile.component.html',
    styleUrls: ['./public-navbar-mobile.component.scss'],
    standalone: true,
    imports: [
        NgClass,
        AngularSvgIconModule,
        PublicNavbarMobileMenuComponent,
    ],
    providers: [PublicMenuService]
})
export class PublicNavbarMobileComponent implements OnInit {
  constructor(public menuService: PublicMenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = false;
  }
}


