
import { Deserialize } from '../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../shared/transformation/serialize';
import { BaseCategoryResponse } from '../../category/http/response/base-category-response.model';
import { BaseDocumentResponse } from '../../document/http/response/base-document-response.model';

export class CategoryDocumentCreateRequest implements Serialize<object>, Deserialize<string> {
  private _category: BaseCategoryResponse | null;
  private _document: BaseDocumentResponse | null;

  constructor(category: BaseCategoryResponse | null = null, document: BaseDocumentResponse | null = null) {
    this._category = category;
    this._document = document;
  }

  public get getCategory(): BaseCategoryResponse | null {
    return this._category;
  }

  public set setCategory(category: BaseCategoryResponse | null) {
    this._category = category;
  }

  public get getDocument(): BaseDocumentResponse | null {
    return this._document;
  }

  public set setDocument(document: BaseDocumentResponse | null) {
    this._document = document;
  }

  serialize(): object {
    return {
      category: this.getCategory?.serialize() ?? {},
      document: this.getDocument?.serialize() ?? {},
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `CategoryDocumentCreateRequest [category=${this.getCategory?.getName ?? ''}, document=${this.getDocument?.getTitle ?? ''}]`;
  }
}
