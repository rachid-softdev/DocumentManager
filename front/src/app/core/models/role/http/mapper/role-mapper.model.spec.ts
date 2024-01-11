import { TestBed } from '@angular/core/testing';
import { RoleMapper } from './role-mapper.model';
import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';

describe('RoleMapper', () => {
  it('should create an instance', () => {
    let baseUserMapper = null;
    beforeEach(() => {
      TestBed.configureTestingModule({});
      baseUserMapper = TestBed.inject(BaseUserMapper);
    });
    if (baseUserMapper) {
    expect(new RoleMapper(baseUserMapper)).toBeTruthy();
    } else {
      fail('Dependencies are null');
    }
  });
});
