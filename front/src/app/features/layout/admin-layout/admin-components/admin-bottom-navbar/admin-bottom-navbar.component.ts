import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-admin-bottom-navbar',
  templateUrl: './admin-bottom-navbar.component.html',
  styleUrls: ['./admin-bottom-navbar.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule],
})
export class AdminBottomNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
