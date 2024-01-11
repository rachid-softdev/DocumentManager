import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../shared/transformation/deserialize';
import { CategoryMapper } from '../../category/http/mapper/category-mapper.model';
import { DocumentMapper } from '../../document/http/mapper/document-mapper.model';
import { BaseCategoryDocumentResponse } from '../response/base-category-document-response.model';
import { CategoryDocumentResponseAPI } from '../response/category-document-response-api.model';
import { CategoryDocumentResponse } from '../response/category-document-response.model';
import { BaseCategoryDocumentMapper } from './base-category-document-mapper.model';

@Injectable()
export class CategoryDocumentMapper
  extends BaseCategoryDocumentMapper
  implements Deserialize<CategoryDocumentResponse>
{
  constructor(
    private readonly _categoryMapper: CategoryMapper,
    private readonly _documentMapper: DocumentMapper,
  ) {
    super(_categoryMapper, _documentMapper);
  }

  override destructor() {}

  override deserialize(input: CategoryDocumentResponseAPI): CategoryDocumentResponse {
    const baseCategoryDocumentResponse: BaseCategoryDocumentResponse = super.deserialize(input);
    return baseCategoryDocumentResponse;
  }
}
