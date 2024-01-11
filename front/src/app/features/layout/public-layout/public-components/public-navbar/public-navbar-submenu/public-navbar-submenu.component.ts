import { Component, Input, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgFor, NgTemplateOutlet, NgIf } from '@angular/common';
import { PublicSubMenuItem } from '../../../public-menu/model/public-menu.model';

@Component({
  selector: 'div[public-navbar-submenu]',
  templateUrl: './public-navbar-submenu.component.html',
  styleUrls: ['./public-navbar-submenu.component.scss'],
  standalone: true,
  imports: [NgFor, NgTemplateOutlet, RouterLinkActive, RouterLink, NgIf, AngularSvgIconModule],
})
export class PublicNavbarSubmenuComponent implements OnInit {
  @Input() public submenu = <PublicSubMenuItem[]>{};

  constructor() {}

  ngOnInit(): void {}
}


