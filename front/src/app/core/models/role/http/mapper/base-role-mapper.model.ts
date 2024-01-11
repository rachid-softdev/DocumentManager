import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { BaseRoleResponse } from '../response/base-role-response.model';
import { BaseRoleResponseAPI } from '../response/base-role-response-api.model';

@Injectable()
export class BaseRoleMapper implements Deserialize<BaseRoleResponse> {
  constructor() {}
  destructor() {}

  public deserialize(input: BaseRoleResponseAPI): BaseRoleResponse {
    const { id = '', name = '' } = input || {};
    const baseRoleResponse = new BaseRoleResponse(id, name.toUpperCase());
    return baseRoleResponse;
  }
}
