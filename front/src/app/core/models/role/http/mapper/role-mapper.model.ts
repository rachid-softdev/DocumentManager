import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { RoleResponseAPI } from '../response/role-response-api.model';
import { BaseRoleMapper } from './base-role-mapper.model';
import { RoleResponse } from '../response/role-response.model';
import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';

@Injectable()
export class RoleMapper extends BaseRoleMapper implements Deserialize<RoleResponse> {
  constructor(private readonly _baseUserMapper: BaseUserMapper) {
    super();
  }
  override destructor() {}

  public override deserialize(input: RoleResponseAPI): RoleResponse {
    const baseRoleResponse = super.deserialize(input);
    const { users } = input || {};
    const roleResponse = new RoleResponse(
      baseRoleResponse.getId,
      baseRoleResponse.getName.toUpperCase(),
      users?.map((user) => {
        return this._baseUserMapper.deserialize(user);
      }) ?? [],
    );
    return roleResponse;
  }
}
