import { RoleResponseAPI } from './role-response-api.model'

describe('RoleResponseAPI', () => {
  it('should create an instance', () => {
    const instance: RoleResponseAPI = {
      users: [],
    };
    expect(instance).toBeTruthy();
  });
});
