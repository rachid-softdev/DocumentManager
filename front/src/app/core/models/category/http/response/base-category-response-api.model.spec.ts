import { BaseCategoryResponseAPI } from './base-category-response-api.model'

describe('BaseCategoryResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseCategoryResponseAPI = {
      id: '',
      name: '',
      description: '',
    };
    expect(instance).toBeTruthy();
  });
});
