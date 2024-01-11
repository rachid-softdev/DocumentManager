import { Injectable } from '@angular/core';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { BaseCategoryMapper } from '../../../category/http/mapper/base-category-mapper.model';
import { BaseDocumentResponse } from '../response/base-document-response.model';
import { DocumentResponseAPI } from '../response/document-response-api.model';
import { DocumentResponse } from '../response/document-response.model';
import { BaseDocumentMapper } from './base-document-mapper.model';
import { BaseUserMapper } from '../../../user/http/mapper/base-user-mapper.model';
import { CategoryMapper } from '../../../category/http/mapper/category-mapper.model';

@Injectable()
export class DocumentMapper extends BaseDocumentMapper implements Deserialize<DocumentResponse> {
  constructor(private readonly _userMapper: BaseUserMapper, private readonly _categoryMapper: CategoryMapper) {
    super(_userMapper);
  }

  override destructor() {}

  override deserialize(input: DocumentResponseAPI): DocumentResponse {
    const baseDocumentResponse: BaseDocumentResponse = super.deserialize(input);
    const { categories = [] } = input || {};
    const documentResponse: DocumentResponse = new DocumentResponse(
      baseDocumentResponse.getId,
      baseDocumentResponse.getTitle,
      baseDocumentResponse.getDescription,
      baseDocumentResponse.getFileUrl,
      baseDocumentResponse.getSenderUser,
      baseDocumentResponse.getIsValidated,
      baseDocumentResponse.getValidatorUser,
      baseDocumentResponse.getValidatedAt,
      [],
    );
    documentResponse.setCategories = categories.map((category) => this._categoryMapper.deserialize(category));
    return documentResponse;
  }
}
