import { CategoryDocumentResponseAPI } from './category-document-response-api.model'

describe('CategoryDocumentResponseAPI', () => {
  it('should create an instance', () => {
    const instance: CategoryDocumentResponseAPI = {
      category: {},
      document: {},
    };
    expect(instance).toBeTruthy();
  });
});
