import { Deserialize } from "../../../../shared/transformation/deserialize";
import { Serialize } from "../../../../shared/transformation/serialize";
import { BaseCategoryResponse } from "../../category/http/response/base-category-response.model";
import { BaseUserResponse } from "../../user/http/response/base-user-response.model";

export class BaseUserCategorySubscriptionResponse implements Serialize<object>, Deserialize<string> {
  private _user: BaseUserResponse | null;
  private _category: BaseCategoryResponse | null;

  constructor(user: BaseUserResponse | null = null, category: BaseCategoryResponse | null = null) {
    this._user = user;
    this._category = category;
  }

  destructor() {}

  public get getUser(): BaseUserResponse | null {
    return this._user;
  }

  public set setUser(user: BaseUserResponse | null) {
    this._user = user;
  }

  public get getCategory(): BaseCategoryResponse | null {
    return this._category;
  }

  public set setCategory(category: BaseCategoryResponse | null) {
    this._category = category;
  }

  serialize(): object {
    return {
      user: this.getUser?.serialize() ?? {},
      category: this.getCategory?.serialize() ?? {},
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `BaseUserCategorySubscriptionResponse [user=${this.getUser?.getEmail ?? ''} category=${this.getCategory?.getName ?? ''}}]`;
  }
}
