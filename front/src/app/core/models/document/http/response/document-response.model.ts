import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseCategoryResponse } from '../../../category/http/response/base-category-response.model';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';
import { BaseDocumentResponse } from './base-document-response.model';

export class DocumentResponse extends BaseDocumentResponse implements Serialize<object>, Deserialize<string> {
  // Un document peut appartenir à plusieurs catégories
  private _categories: BaseCategoryResponse[];

  constructor(
    id: string = '',
    title: string = '',
    description: string = '',
    fileUrl: string = '',
    senderUser: BaseUserResponse | null = null,
    isValidated: boolean = false,
    validatorUser: BaseUserResponse | null = null,
    validatedAt: string = '',
    categories: BaseCategoryResponse[] = [],
  ) {
    super(id, title, description, fileUrl, senderUser, isValidated, validatorUser, validatedAt);
    this._categories = categories;
  }

  public get getCategories() {
    return this._categories;
  }

  public set setCategories(categories: BaseCategoryResponse[]) {
    this._categories = categories;
  }

  public override serialize(): object {
    return super.serialize();
  }

  public override deserialize(input: any): string {
    return Object.assign(this, input);
  }

  public override toString(): string {
    return `DocumentResponse [id=${this.getId}, title=${this.getTitle}, description=${this.getDescription}, file=${this.getFileUrl}, sender_user=${this.getSenderUser?.getEmail}, validator_user=${this.getValidatorUser?.getEmail}, validated_at=${this.getValidatedAt}]`;
  }
}
