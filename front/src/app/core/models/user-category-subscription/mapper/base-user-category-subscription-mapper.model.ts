import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../shared/transformation/deserialize';
import { BaseCategoryMapper } from '../../category/http/mapper/base-category-mapper.model';
import { BaseUserMapper } from '../../user/http/mapper/base-user-mapper.model';
import { BaseUserCategorySubscriptionResponseAPI } from '../response/base-user-category-subscription-response-api.model';
import { BaseUserCategorySubscriptionResponse } from '../response/base-user-category-subscription-response.model';
import { UserCategorySubscriptionResponse } from '../response/user-category-subscription-response.model';
import { BaseUserResponse } from '../../user/http/response/base-user-response.model';
import { BaseCategoryResponse } from '../../category/http/response/base-category-response.model';

@Injectable()
export class BaseUserCategorySubscriptionMapper implements Deserialize<BaseUserCategorySubscriptionResponse> {
  
  constructor(
    private readonly _baseUserMapper: BaseUserMapper,
    private readonly _baseCategoryMapper: BaseCategoryMapper,
  ) {}

  destructor() {}

  deserialize(input: BaseUserCategorySubscriptionResponseAPI): BaseUserCategorySubscriptionResponse {
    const { user = null, category = null } = input || {};
    const userResponse: BaseUserResponse | null = user ? this._baseUserMapper.deserialize(user) : null;
    const categoryResponse: BaseCategoryResponse | null = category
      ? this._baseCategoryMapper.deserialize(category)
      : null;
    const userCategoryResponse: UserCategorySubscriptionResponse = new UserCategorySubscriptionResponse(
      userResponse,
      categoryResponse,
    );
    return userCategoryResponse;
  }
}
