import { Injectable } from '@angular/core';
import { BaseUserMapper } from './base-user-mapper.model';
import { UserResponseAPI } from '../response/user-response-api.model';
import { UserResponse } from '../response/user-response.model';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { BaseRoleMapper } from '../../../role/http/mapper/base-role-mapper.model';

@Injectable()
export class UserMapper extends BaseUserMapper implements Deserialize<UserResponse> {
  constructor(private readonly _baseRoleMapper: BaseRoleMapper) {
    super();
  }
  override destructor() {}

  public override deserialize(input: UserResponseAPI): UserResponse {
    const baseUserResponse = super.deserialize(input);
    const { roles } = input || {};
    const userResponse = new UserResponse(
      baseUserResponse.getCreatedAt,
      baseUserResponse.getUpdatedAt,
      baseUserResponse.getId,
      baseUserResponse.getLastname,
      baseUserResponse.getFirstname,
      baseUserResponse.getEmail,
      '',
      roles?.map((role) => {
        return this._baseRoleMapper.deserialize(role);
      }) ?? [],
    );
    return userResponse;
  }
}
