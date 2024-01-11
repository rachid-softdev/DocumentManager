import { BaseUserCategorySubscriptionResponseAPI } from './base-user-category-subscription-response-api.model';

describe('BaseUserCategorySubscriptionResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseUserCategorySubscriptionResponseAPI = {
      user: {},
      category: {},
    };
    expect(instance).toBeTruthy();
  });
});
