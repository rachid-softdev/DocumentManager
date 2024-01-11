import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  public _default = 'light';
  public _themeChanged = signal(this.theme);

  constructor() {}

  public get theme(): string {
    return localStorage.getItem('theme') ?? this._default;
  }

  public set theme(value: string) {
    localStorage.setItem('theme', value);
    this._themeChanged.set(value);
  }

  public get isDark(): boolean {
    return this.theme == 'dark';
  }
}
