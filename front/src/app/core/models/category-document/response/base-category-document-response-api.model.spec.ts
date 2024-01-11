import { BaseCategoryDocumentResponseAPI } from './base-category-document-response-api.model'

describe('BaseCategoryDocumentResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseCategoryDocumentResponseAPI = {
      category: {},
      document: {},
    };
    expect(instance).toBeTruthy();
  });
});
