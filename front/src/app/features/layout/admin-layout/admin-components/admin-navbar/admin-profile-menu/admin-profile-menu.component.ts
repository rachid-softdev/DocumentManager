import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ClickOutsideDirective } from '../../../../../../shared/directives/click-outside.directive';
import { UserStorageService } from '../../../../../../core/services/user-storage.service';
import { AuthenticationService } from '../../../../../../core/services/authentication/authentication.service';
import { UserResponse } from '../../../../../../core/models/user/http/response/user-response.model';

@Component({
  selector: 'app-admin-profile-menu',
  templateUrl: './admin-profile-menu.component.html',
  styleUrls: ['./admin-profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink],
})
export class AdminProfileMenuComponent implements OnInit, OnDestroy {
  public isMenuOpen = false;
  private _user: UserResponse | null;

  constructor(private _tokenStorageService: UserStorageService, private _authenticationService: AuthenticationService) {
    this._user = _tokenStorageService.getUser();
  }

  ngOnInit(): void { }
  ngOnDestroy(): void { }

  public get getUser(): UserResponse | null {
    return this._user;
  }

  public set setUser(user: UserResponse | null) {
    this._user = user;
  }

  public toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  public logout(): void {
    this._authenticationService.logout();
  }
}
