import { DocumentResponseAPI } from './document-response-api.model'

describe('DocumentResponseAPI', () => {
  it('should create an instance', () => {
    const instance: DocumentResponseAPI = {
      categories: []
    };
    expect(instance).toBeTruthy();
  });
});
