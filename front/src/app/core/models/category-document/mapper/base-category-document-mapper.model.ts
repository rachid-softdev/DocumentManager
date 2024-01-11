import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../shared/transformation/deserialize';
import { BaseCategoryDocumentResponse } from '../response/base-category-document-response.model';
import { BaseCategoryDocumentResponseAPI } from '../response/base-category-document-response-api.model';
import { BaseCategoryMapper } from '../../category/http/mapper/base-category-mapper.model';
import { BaseDocumentMapper } from '../../document/http/mapper/base-document-mapper.model';
import { BaseCategoryResponse } from '../../category/http/response/base-category-response.model';
import { BaseDocumentResponse } from '../../document/http/response/base-document-response.model';

@Injectable()
export class BaseCategoryDocumentMapper implements Deserialize<BaseCategoryDocumentResponse> {
  constructor(private _baseCategoryMapper: BaseCategoryMapper, private _baseDocumentMapper: BaseDocumentMapper) {}
  destructor() {}

  deserialize(input: BaseCategoryDocumentResponseAPI): BaseCategoryDocumentResponse {
    const { category = null, document = null } = input || {};
    const categoryResponse: BaseCategoryResponse | null = category ? this._baseCategoryMapper.deserialize(category) : null;
    const documentResponse: BaseDocumentResponse | null = document ? this._baseDocumentMapper.deserialize(document) : null;
    const baseCategoryDocumentResponse = new BaseCategoryDocumentResponse(categoryResponse, documentResponse);
    return baseCategoryDocumentResponse;
  }
}
