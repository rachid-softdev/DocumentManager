import { Injectable } from '@angular/core';
import { CategoryResponseAPI } from '../response/category-response-api.model';
import { CategoryResponse } from '../response/category-response.model';
import { BaseCategoryMapper } from './base-category-mapper.model';

@Injectable()
export class CategoryMapper extends BaseCategoryMapper {

  constructor() {
    super();
  }

  override deserialize(input: CategoryResponseAPI): CategoryResponse {
    const baseCategoryResponse = super.deserialize(input);
    const { subcategories = [] } = input || {};
    const categoryResponse = new CategoryResponse(
      baseCategoryResponse.getId,
      baseCategoryResponse.getName,
      baseCategoryResponse.getDescription,
      [],
    );
    categoryResponse.setSubcategories = subcategories.map((subcategory) => this.deserialize(subcategory));
    return categoryResponse;
  }
}
