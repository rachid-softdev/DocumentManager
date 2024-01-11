import { BaseCategoryDocumentMapper } from './base-category-document-mapper.model';
import { BaseCategoryMapper } from '../../category/http/mapper/base-category-mapper.model';
import { BaseDocumentMapper } from '../../document/http/mapper/base-document-mapper.model';
import { TestBed } from '@angular/core/testing';

describe('BaseCategoryDocumentMapper', () => {
  it('should create an instance', () => {
    let baseCategoryMapper = null;
    let baseDocumentMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      baseCategoryMapper = TestBed.inject(BaseCategoryMapper);
      baseDocumentMapper = TestBed.inject(BaseDocumentMapper);
    });
    if (baseCategoryMapper && baseDocumentMapper) {
      expect(new BaseCategoryDocumentMapper(baseCategoryMapper, baseDocumentMapper)).toBeTruthy();
    } else {
      fail('Dependencies are null');
    }
  });
});
