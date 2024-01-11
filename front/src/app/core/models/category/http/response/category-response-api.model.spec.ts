import { CategoryResponseAPI } from './category-response-api.model'

describe('CategoryResponseAPI', () => {
  it('should create an instance', () => {
    const instance: CategoryResponseAPI = {
      subcategories: []
    };
    expect(instance).toBeTruthy();
  });
});
