import { Injectable } from '@angular/core';
import { UserCreateRequest } from '../request/user-create-request.model';
import { BaseUserResponse } from '../response/base-user-response.model';
import { UserUpdateRequest } from '../request/user-update-request.model';
import { BaseUserResponseAPI } from '../response/base-user-response-api.model';
import { Deserialize } from '../../../../../shared/transformation/deserialize';

@Injectable()
export class BaseUserMapper implements Deserialize<BaseUserResponse> {
  constructor() {}
  destructor() {}

  public deserialize(input: BaseUserResponseAPI): BaseUserResponse {
    const { id = '', firstname = '', lastname = '', email = '' } = input || {};
    const baseUserResponse = new BaseUserResponse('', '', id, lastname, firstname, email, '');
    return baseUserResponse;
  }
}
