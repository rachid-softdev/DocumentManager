import { BaseRoleResponseAPI } from './base-role-response-api.model';

describe('BaseRoleResponseAPI', () => {
  it('should create an instance', () => {
    const instance: BaseRoleResponseAPI = {
      id: '',
      name: '',
    };
    expect(instance).toBeTruthy();
  });
});
