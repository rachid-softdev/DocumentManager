import { BaseUserResponseAPI } from './base-user-response-api.model'

describe('BaseUserResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseUserResponseAPI = {
      id: '',
      firstname: '',
      lastname: '',
      email: ''
    };
    expect(instance).toBeTruthy();
  });
});
