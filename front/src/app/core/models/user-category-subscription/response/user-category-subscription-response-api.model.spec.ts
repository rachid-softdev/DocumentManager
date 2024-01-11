import { UserCategorySubscriptionResponseAPI } from './user-category-subscription-response-api.model';

describe('UserCategorySubscriptionResponseAPI', () => {
  it('should create an instance', () => {
    const instance: UserCategorySubscriptionResponseAPI = {
      user: {},
      category: {},
    };
    expect(instance).toBeTruthy();
  });
});
