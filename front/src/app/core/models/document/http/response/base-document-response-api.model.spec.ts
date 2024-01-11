import { BaseDocumentResponseAPI } from './base-document-response-api.model';

describe('BaseDocumentResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseDocumentResponseAPI = {
      id: '',
      title: '',
      description: '',
      file_url: '',
      sender_user: undefined,
      validator_user: undefined,
      is_validated: false,
      validated_at: '',
    };
    expect(instance).toBeTruthy();
  });
});
