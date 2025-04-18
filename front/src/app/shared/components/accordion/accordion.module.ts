import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionComponent } from './accordion.component';
import { AccordionItem } from './directives/accordion-item.directive';
import { AccordionContent } from './directives/accordion-content.directive';
import { AccordionTitle } from './directives/accordion-title.directive';
import { AccordionHeader } from './directives/accordion-header.directive';

/**
 * Source : https://sreyaj.dev/customizable-accordion-component-angular
 * Sandbox : https://codesandbox.io/p/sandbox/ng-accordion-forked-5cy5d5
 */
@NgModule({
  declarations: [AccordionComponent, AccordionItem, AccordionContent, AccordionTitle, AccordionHeader],
  imports: [CommonModule],
  exports: [AccordionComponent, AccordionItem, AccordionContent, AccordionTitle, AccordionHeader],
})
export class AccordionModule {}
