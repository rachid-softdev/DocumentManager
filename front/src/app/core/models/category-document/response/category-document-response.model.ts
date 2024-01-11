import { Deserialize } from '../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../shared/transformation/serialize';
import { BaseCategoryResponse } from '../../category/http/response/base-category-response.model';
import { BaseDocumentResponse } from '../../document/http/response/base-document-response.model';
import { BaseCategoryDocumentResponse } from './base-category-document-response.model';

export class CategoryDocumentResponse extends BaseCategoryDocumentResponse implements Serialize<object>, Deserialize<string> {
  
  constructor(category: BaseCategoryResponse | null = null, document: BaseDocumentResponse | null = null) {
    super(category, document);
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
    return `CategoryDocumentResponse ${super.toString()}`;
  }
}
