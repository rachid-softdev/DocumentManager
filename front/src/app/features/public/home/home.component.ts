import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private _year: number = new Date().getFullYear();

  public get getYear() {
    return this._year;
  }

}
