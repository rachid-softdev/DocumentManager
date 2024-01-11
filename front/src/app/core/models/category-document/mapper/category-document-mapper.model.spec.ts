import { CategoryMapper } from '../../category/http/mapper/category-mapper.model';
import { DocumentMapper } from '../../document/http/mapper/document-mapper.model';
import { CategoryDocumentMapper } from './category-document-mapper.model';
import { TestBed } from '@angular/core/testing';

describe('CategoryDocumentMapper', () => {
  it('should create an instance', () => {
    let categoryMapper = null;
    let documentMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      categoryMapper = TestBed.inject(CategoryMapper);
      documentMapper = TestBed.inject(DocumentMapper);
    });
    if (categoryMapper && documentMapper) {
      expect(new CategoryDocumentMapper(categoryMapper, documentMapper)).toBeTruthy();
    } else {
      fail('Dependencies are null');
    }
  });
});
