import { BaseUserResponseAPI } from '../../user/http/response/base-user-response-api.model';
import { BaseCategoryResponseAPI } from '../../category/http/response/base-category-response-api.model';

export type BaseUserCategorySubscriptionResponseAPI = {
  user?: BaseUserResponseAPI;
  category?: BaseCategoryResponseAPI;
};
