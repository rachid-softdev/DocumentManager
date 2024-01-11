import { Component, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-public-bottom-navbar',
  templateUrl: './public-bottom-navbar.component.html',
  styleUrls: ['./public-bottom-navbar.component.scss'],
  standalone: true,
  imports: [AngularSvgIconModule],
})
export class PublicBottomNavbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}


