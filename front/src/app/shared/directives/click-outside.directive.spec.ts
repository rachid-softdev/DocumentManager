import { ElementRef } from '@angular/core';
import { ClickOutsideDirective } from './click-outside.directive';
import { TestBed } from '@angular/core/testing';

describe('ClickOutsideDirective', () => {
  it('should create an instance', () => {
    let element = null;
    let document = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      element = TestBed.inject(ElementRef);
      document = TestBed.inject(Document);
    });
    if (element && document) {
      const directive = new ClickOutsideDirective(element, document);
      expect(directive).toBeTruthy();
    } else {
      fail('Dependencies are null');
    }
  });
});
