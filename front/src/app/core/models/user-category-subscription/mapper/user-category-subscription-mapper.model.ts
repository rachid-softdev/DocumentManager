import { Injectable } from '@angular/core';
import { CategoryMapper } from '../../category/http/mapper/category-mapper.model';
import { BaseUserMapper } from '../../user/http/mapper/base-user-mapper.model';
import { UserCategorySubscriptionResponseAPI } from '../response/user-category-subscription-response-api.model';
import { UserCategorySubscriptionResponse } from '../response/user-category-subscription-response.model';
import { BaseUserCategorySubscriptionMapper } from './base-user-category-subscription-mapper.model';

@Injectable()
export class UserCategorySubscriptionMapper extends BaseUserCategorySubscriptionMapper {
  
  constructor(private readonly _userMapper: BaseUserMapper, private readonly _categoryMapper: CategoryMapper) {
    super(_userMapper, _categoryMapper);
  }

  override destructor() {}

  override deserialize(input: UserCategorySubscriptionResponseAPI): UserCategorySubscriptionResponse {
    const userCategorySubscriptionResponse: UserCategorySubscriptionResponse = super.deserialize(input);
    return userCategorySubscriptionResponse;
  }
}
