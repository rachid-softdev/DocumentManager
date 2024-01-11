import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListDeleteComponent } from './document-list-delete.component';

describe('DocumentListDeleteComponent', () => {
  let component: DocumentListDeleteComponent;
  let fixture: ComponentFixture<DocumentListDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentListDeleteComponent],
    });
    fixture = TestBed.createComponent(DocumentListDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
