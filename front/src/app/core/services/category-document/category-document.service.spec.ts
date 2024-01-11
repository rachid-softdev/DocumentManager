import { TestBed } from '@angular/core/testing';

import { CategoryDocumentService } from './category-document.service';

describe('CategoryDocumentService', () => {
  let service: CategoryDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
