import { UserCategorySubscriptionMapper } from './user-category-subscription-mapper.model';

describe('UserCategorySubscriptionMapper', () => {
  it('should create an instance', () => {
    let baseUserMapper = null;
    let categoryMapper = null;
    if (baseUserMapper && categoryMapper)
      expect(new UserCategorySubscriptionMapper(baseUserMapper, categoryMapper)).toBeTruthy();
    else fail('Dependencies are null');
  });
});
