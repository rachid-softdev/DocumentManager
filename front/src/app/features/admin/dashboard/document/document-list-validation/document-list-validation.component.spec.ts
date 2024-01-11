import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListValidationComponent } from './document-list-validation.component';

describe('DocumentListValidationComponent', () => {
  let component: DocumentListValidationComponent;
  let fixture: ComponentFixture<DocumentListValidationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentListValidationComponent]
    });
    fixture = TestBed.createComponent(DocumentListValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
