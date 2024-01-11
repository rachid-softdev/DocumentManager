import { Component, OnInit } from '@angular/core';
import { UserNavbarSubmenuComponent } from '../user-navbar-submenu/user-navbar-submenu.component';
import { NgFor, NgClass } from '@angular/common';
import { UserMenuItem } from '../../../user-menu/model/user-menu.model';
import { UserMenuService } from '../../../user-menu/service/user-menu.service';

@Component({
  selector: 'app-user-navbar-menu',
  templateUrl: './user-navbar-menu.component.html',
  styleUrls: ['./user-navbar-menu.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, UserNavbarSubmenuComponent],
  providers: [UserMenuService],
})
export class UserNavbarMenuComponent implements OnInit {
  private showMenuClass = ['scale-100', 'animate-fade-in-up', 'opacity-100', 'pointer-events-auto'];
  private hideMenuClass = ['scale-95', 'animate-fade-out-down', 'opacity-0', 'pointer-events-none'];

  constructor(public menuService: UserMenuService) {}

  ngOnInit(): void {}

  public toggleMenu(menu: UserMenuItem): void {
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

