import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseCategoryResponse } from './base-category-response.model';

export class CategoryResponse extends BaseCategoryResponse implements Serialize<object>, Deserialize<string> {
  private _subcategories: CategoryResponse[];

  constructor(
    id: string = '',
    name: string = '',
    description: string = '',
    subcategories: CategoryResponse[] = [],
  ) {
    super(id, name, description);
    this._subcategories = subcategories;
  }

  public get getSubcategories(): CategoryResponse[] {
    return this._subcategories;
  }

  public set setSubcategories(subcategories: CategoryResponse[]) {
    this._subcategories = subcategories;
  }

  public addSubcategory(subCategory: CategoryResponse) {
    this._subcategories.push(subCategory);
  }

  public removeSubcategory(subCategory: CategoryResponse) {
    const index = this._subcategories.indexOf(subCategory);
    if (index !== -1) {
      this._subcategories = this._subcategories.splice(index, 1);
    }
  }

  override serialize(): object {
    return {
      // Inclut les propriétés de la classe parente
      ...super.serialize(),
      subcategories: this._subcategories.map(subcategory => subcategory.serialize())
    };
  }

  override deserialize(input: any): string {
    return Object.assign(this, input);
  }

  override toString(): string {
    return `CategoryResponse { id: ${this.getId}, name: ${this.getName}, description: ${
      this.getDescription
    }, subcategories: ${this._subcategories.map((sub) => sub.toString()).join(', ')} }`;
  }
}
