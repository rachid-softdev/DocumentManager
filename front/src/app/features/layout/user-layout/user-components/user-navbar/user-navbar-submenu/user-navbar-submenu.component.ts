import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { UserSubMenuItem } from '../../../user-menu/model/user-menu.model';

@Component({
  selector: 'div[user-navbar-submenu]',
  templateUrl: './user-navbar-submenu.component.html',
  styleUrls: ['./user-navbar-submenu.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, NgIf, AngularSvgIconModule],
})
export class UserNavbarSubmenuComponent implements OnInit {
  @Input() public submenu = <UserSubMenuItem[]>{};

  constructor() {}

  ngOnInit(): void {}
}

