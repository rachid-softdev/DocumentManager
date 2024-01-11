import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomPaginatorComponent } from './components/custom-paginator/custom-paginator/custom-paginator.component';
import { ResponsiveHelperComponent } from './components/responsive-helper/responsive-helper.component';
import { AccordionModule } from './components/accordion/accordion.module';
import { PublicHeaderComponent } from './components/header/public/public-header.component';
import { LanguageDropdownComponent } from './components/language-dropdown/language-dropdown.component';
import { HTMLEntityDecode } from './pipes/html-entity-decode.pipe';

@NgModule({
  declarations: [
    CustomPaginatorComponent,
    ResponsiveHelperComponent,
    PublicHeaderComponent,
    LanguageDropdownComponent,
    // Pour l'utiliser en injection de dépendances dans les .html des components
    HTMLEntityDecode,
  ],
  imports: [CommonModule, RouterModule, AccordionModule],
  exports: [
    CustomPaginatorComponent,
    ResponsiveHelperComponent,
    PublicHeaderComponent,
    // Pour l'utiliser en injection de dépendances dans les .html des components
    LanguageDropdownComponent,
    HTMLEntityDecode,
  ],
  // Pour l'utiliser en injection de dépendances dans les .ts des components
  providers: [HTMLEntityDecode],
})
export class SharedModule {}
