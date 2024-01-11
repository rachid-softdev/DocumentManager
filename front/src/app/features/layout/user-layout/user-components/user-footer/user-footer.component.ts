import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrls: ['./user-footer.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class UserFooterComponent implements OnInit, OnDestroy {
  private _originDate: Date = new Date(2023, 1, 1);
  private _currentDate = new Date();

  public constructor() {
    this._originDate = new Date(2023, 1, 1);
    this._currentDate = new Date();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  public get getOriginDate(): Date {
    return this._originDate;
  }

  public get getCurrentDate(): Date {
    return this._currentDate;
  }
}

