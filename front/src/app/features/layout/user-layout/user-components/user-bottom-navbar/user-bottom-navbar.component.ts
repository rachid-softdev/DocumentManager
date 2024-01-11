import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-user-bottom-navbar',
  templateUrl: './user-bottom-navbar.component.html',
  styleUrls: ['./user-bottom-navbar.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule],
})
export class UserBottomNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

