import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../../shared/directives/click-outside.directive';

@Component({
  selector: 'app-public-profile-menu',
  templateUrl: './public-profile-menu.component.html',
  styleUrls: ['./public-profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink],
})
export class PublicProfileMenuComponent implements OnInit {
  public isMenuOpen = false;

  constructor() {}

  ngOnInit(): void {}

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}


