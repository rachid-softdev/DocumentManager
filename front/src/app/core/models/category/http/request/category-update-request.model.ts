import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class CategoryUpdateRequest implements Serialize<object>, Deserialize<string> {
  private _name: string;
  private _description: string;
  private _parentCategoryId: string | null;

  constructor(name: string = '', description: string = '', parentCategoryId: string | null = null) {
    this._name = name;
    this._description = description;
    this._parentCategoryId = parentCategoryId;
  }

  public get getName(): string {
    return this._name;
  }

  public set setName(name: string) {
    this._name = name;
  }

  public get getDescription(): string {
    return this._description;
  }

  public set setDescription(description: string) {
    this._description = description;
  }

  public get getParentCategoryId(): string | null {
    return this._parentCategoryId;
  }

  public set setParentCategoryId(parentCategoryId: string) {
    this._parentCategoryId = parentCategoryId;
  }

  public serialize(): object {
    return {
      name: this.getName,
      description: this.getDescription,
      parent_category_id: this.getParentCategoryId,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `CategoryUpdateRequest [name=${this._name}, description=${this._description}, parent_category_id=${this._parentCategoryId}]`;
  }
}
