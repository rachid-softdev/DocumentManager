import { Component, OnInit } from '@angular/core';
import { PublicNavbarSubmenuComponent } from '../public-navbar-submenu/public-navbar-submenu.component';
import { NgFor, NgClass } from '@angular/common';
import { PublicMenuItem } from '../../../public-menu/model/public-menu.model';
import { PublicMenuService } from '../../../public-menu/service/public-menu.service';

@Component({
  selector: 'app-public-navbar-menu',
  templateUrl: './public-navbar-menu.component.html',
  styleUrls: ['./public-navbar-menu.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, PublicNavbarSubmenuComponent],
  providers: [PublicMenuService],
})
export class PublicNavbarMenuComponent implements OnInit {
  private showMenuClass = ['scale-100', 'animate-fade-in-up', 'opacity-100', 'pointer-events-auto'];
  private hideMenuClass = ['scale-95', 'animate-fade-out-down', 'opacity-0', 'pointer-events-none'];

  constructor(public menuService: PublicMenuService) {}

  ngOnInit(): void {}

  public toggleMenu(menu: PublicMenuItem): void {
    menu.selected = !menu.selected;
  }

  public mouseEnter(event: any): void {
    let element = event.target.querySelector('app-navbar-submenu').children[0];
    if (element) {
      this.hideMenuClass.forEach((c) => element.classList.remove(c));
      this.showMenuClass.forEach((c) => element.classList.add(c));
    }
  }

  public mouseLeave(event: any): void {
    let element = event.target.querySelector('app-navbar-submenu').children[0];
    if (element) {
      this.showMenuClass.forEach((c) => element.classList.remove(c));
      this.hideMenuClass.forEach((c) => element.classList.add(c));
    }
  }
}


