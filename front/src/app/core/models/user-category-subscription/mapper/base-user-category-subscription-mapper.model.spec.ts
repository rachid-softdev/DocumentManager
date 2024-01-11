import { BaseUserCategorySubscriptionMapper } from './base-user-category-subscription-mapper.model';
import { BaseUserMapper } from '../../user/http/mapper/base-user-mapper.model';
import { TestBed } from '@angular/core/testing';
import { BaseCategoryMapper } from '../../category/http/mapper/base-category-mapper.model';

describe('BaseUserCategorySubscriptionMapper', () => {
  it('should create an instance', () => {
    let baseUserMapper = null;
    let baseCategoryMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      baseUserMapper = TestBed.inject(BaseUserMapper);
      baseCategoryMapper = TestBed.inject(BaseCategoryMapper);
    });
    if (baseUserMapper && baseCategoryMapper)
      expect(new BaseUserCategorySubscriptionMapper(baseUserMapper, baseCategoryMapper)).toBeTruthy();
    else fail('Dependencies are null');
  });
});
