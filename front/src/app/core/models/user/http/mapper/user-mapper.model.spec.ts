import { TestBed } from '@angular/core/testing';
import { BaseRoleMapper } from '../../../role/http/mapper/base-role-mapper.model';
import { UserMapper } from './user-mapper.model';

describe('UserMapper', () => {
  it('should create an instance', () => {
    let baseRoleMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      baseRoleMapper = TestBed.inject(BaseRoleMapper);
    });
    if (baseRoleMapper) {
      expect(new UserMapper(baseRoleMapper)).toBeTruthy();
    } else {
      fail('Dependencies are null');
    }
  });
});
