import { Component, OnInit } from '@angular/core';
import { AdminNavbarSubmenuComponent } from '../admin-navbar-submenu/admin-navbar-submenu.component';
import { NgFor, NgClass } from '@angular/common';
import { AdminMenuItem } from '../../../admin-menu/model/admin-menu.model';
import { AdminMenuService } from '../../../admin-menu/service/admin-menu.service';

@Component({
  selector: 'app-admin-navbar-menu',
  templateUrl: './admin-navbar-menu.component.html',
  styleUrls: ['./admin-navbar-menu.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, AdminNavbarSubmenuComponent],
  providers: [AdminMenuService],
})
export class AdminNavbarMenuComponent implements OnInit {
  private showMenuClass = ['scale-100', 'animate-fade-in-up', 'opacity-100', 'pointer-events-auto'];
  private hideMenuClass = ['scale-95', 'animate-fade-out-down', 'opacity-0', 'pointer-events-none'];

  constructor(public menuService: AdminMenuService) {}

  ngOnInit(): void {}

  public toggleMenu(menu: AdminMenuItem): void {
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
