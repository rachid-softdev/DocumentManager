import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-dropdown',
  templateUrl: './language-dropdown.component.html',
  styleUrls: ['./language-dropdown.component.css'],
})
export class LanguageDropdownComponent {
  private readonly _storageKey = 'selectedLanguageCode';
  private _supportedLanguages = [
    { code: 'fr', name: 'Français', flag: 'fi-fr' },
    { code: 'en', name: 'English', flag: 'fi-gb' },
  ];
  private _selectedLanguageCode = 'fr';
  private _isDropdownOpen = false;

  public constructor(private readonly _translate: TranslateService) {
    this._selectedLanguageCode = sessionStorage.getItem(this._storageKey) || 'fr';
    // this._translate.setDefaultLang('en');
    this._translate.use(this._selectedLanguageCode);
    console.log(this._selectedLanguageCode);
  }

  public get getSupportedLanguages() {
    return this._supportedLanguages;
  }

  public get selectedLanguageName(): string {
    const selectedLang = this._supportedLanguages.find((lang) => lang.code === this._selectedLanguageCode);
    return selectedLang ? selectedLang.name : '';
  }

  public get getIsDropdownOpen(): boolean {
    return this._isDropdownOpen;
  }

  public get selectedLanguageFlag(): string {
    const selectedLang = this._supportedLanguages.find((lang) => lang.code === this._selectedLanguageCode);
    return selectedLang ? selectedLang.flag : '';
  }

  public toggleDropdown(): void {
    this._isDropdownOpen = !this._isDropdownOpen;
  }

  public selectLanguage(lang: { code: string }): void {
    this._selectedLanguageCode = lang.code;
    sessionStorage.setItem(this._storageKey, this._selectedLanguageCode);
    this._isDropdownOpen = false;
    this._translate.use(lang.code);
    this.toggleDropdown();
  }
}
