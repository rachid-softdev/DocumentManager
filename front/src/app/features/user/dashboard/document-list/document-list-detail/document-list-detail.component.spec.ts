import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentListDetailComponent } from './document-list-detail.component';

describe('DocumentListDetailComponent', () => {
  let component: DocumentListDetailComponent;
  let fixture: ComponentFixture<DocumentListDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentListDetailComponent],
    });
    fixture = TestBed.createComponent(DocumentListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
