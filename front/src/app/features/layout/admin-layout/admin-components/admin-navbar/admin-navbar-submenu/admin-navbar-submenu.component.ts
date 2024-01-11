import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { AdminSubMenuItem } from '../../../admin-menu/model/admin-menu.model';

@Component({
  selector: 'div[admin-navbar-submenu]',
  templateUrl: './admin-navbar-submenu.component.html',
  styleUrls: ['./admin-navbar-submenu.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, NgIf, AngularSvgIconModule],
})
export class AdminNavbarSubmenuComponent implements OnInit {
  @Input() public submenu = <AdminSubMenuItem[]>{};

  constructor() {}

  ngOnInit(): void {}
}
