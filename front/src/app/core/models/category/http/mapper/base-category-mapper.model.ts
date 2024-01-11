import { Injectable } from '@angular/core';
import { BaseCategoryResponseAPI } from '../response/base-category-response-api.model';
import { BaseCategoryResponse } from '../response/base-category-response.model';
import { Deserialize } from '../../../../../shared/transformation/deserialize';

@Injectable()
export class BaseCategoryMapper implements Deserialize<BaseCategoryResponse> {
  
  constructor() {}
  destructor() {}

  deserialize(input: BaseCategoryResponseAPI): BaseCategoryResponse {
    const { id = '', name = '', description = '' } = input || {};
    const categoryResponse = new BaseCategoryResponse(id, name, description);
    return categoryResponse;
  }
}
