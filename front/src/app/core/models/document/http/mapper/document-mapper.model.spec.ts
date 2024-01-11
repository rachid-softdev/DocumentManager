import { CategoryMapper } from '../../../category/http/mapper/category-mapper.model';
import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';
import { DocumentMapper } from './document-mapper.model';
import { TestBed } from '@angular/core/testing';

describe('DocumentMapper', () => {
  it('should create an instance', () => {
    let baseUserMapper = null;
    let categoryMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      baseUserMapper = TestBed.inject(BaseUserMapper);
      categoryMapper = TestBed.inject(CategoryMapper);
    });
    if (baseUserMapper && categoryMapper) expect(new DocumentMapper(baseUserMapper, categoryMapper)).toBeTruthy();
    else fail('Dependencies are null');
  });
});
