import { Deserialize } from '../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../shared/transformation/serialize';
import { BaseCategoryResponse } from '../../category/http/response/base-category-response.model';
import { BaseUserResponse } from '../../user/http/response/base-user-response.model';
import { BaseUserCategorySubscriptionResponse } from './base-user-category-subscription-response.model';

export class UserCategorySubscriptionResponse extends BaseUserCategorySubscriptionResponse implements Serialize<object>, Deserialize<string>
{
  constructor(user: BaseUserResponse | null = null, category: BaseCategoryResponse | null = null) {
    super(user, category);
  }

  override destructor() {}

  override serialize(): object {
    return {
      // Inclut les propriétés de la classe parente
      ...super.serialize(),
    };
  }

  override deserialize(input: any): string {
    return Object.assign(this, input);
  }

  override toString(): string {
    return `UserCategorySubscriptionResponse ${super.toString()}`;
  }
}
