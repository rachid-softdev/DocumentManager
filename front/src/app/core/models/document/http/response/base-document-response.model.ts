import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';

export class BaseDocumentResponse implements Serialize<object>, Deserialize<string> {
  private _id: string;
  private _title: string;
  private _description: string;
  private _fileUrl: string;
  private _senderUser: BaseUserResponse | null;
  private _isValidated: boolean;
  private _validatorUser: BaseUserResponse | null;
  private _validatedAt: string;

  constructor(
    id: string = '',
    title: string = '',
    description: string = '',
    fileUrl: string = '',
    senderUser: BaseUserResponse | null = null,
    isValidated: boolean = false,
    validatorUser: BaseUserResponse | null = null,
    validatedAt: string = '',
  ) {
    this._id = id;
    this._title = title;
    this._description = description;
    this._fileUrl = fileUrl;
    this._senderUser = senderUser;
    this._isValidated = isValidated;
    this._validatorUser = validatorUser;
    this._validatedAt = validatedAt;
  }

  public get getId(): string {
    return this._id;
  }

  public set setId(id: string) {
    this._id = id;
  }

  public get getTitle(): string {
    return this._title;
  }

  public set setTitle(title: string) {
    this._title = title;
  }

  public get getDescription(): string {
    return this._description;
  }

  public set setDescription(title: string) {
    this._description = title;
  }

  public get getFileUrl(): string {
    return this._fileUrl;
  }

  public set setFileUrl(file: string) {
    this._fileUrl = file;
  }

  public get getSenderUser(): BaseUserResponse | null {
    return this._senderUser;
  }

  public set setSenderUser(senderUser: BaseUserResponse | null) {
    this._senderUser = senderUser;
  }

  public get getIsValidated(): boolean {
    return this._isValidated;
  }

  public set setIsValidated(isValidated: boolean) {
    this._isValidated = isValidated;
  }

  public get getValidatorUser(): BaseUserResponse | null {
    return this._validatorUser;
  }

  public set setValidatorUser(validatorUser: BaseUserResponse | null) {
    this._validatorUser = validatorUser;
  }

  public get getValidatedAt(): string {
    return this._validatedAt;
  }

  public set setValidatedAt(validatedAt: string) {
    this._validatedAt = validatedAt;
  }

  serialize(): object {
    return {
      id: this.getId,
      title: this.getTitle,
      description: this.getDescription,
      file: this.getFileUrl,
      sender_user: this.getSenderUser?.serialize(),
      validator_user: this.getValidatorUser?.serialize(),
      validated_at: this.getValidatedAt,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  public toString(): string {
    return `BaseDocumentResponse [id=${this._id}, title=${this.getTitle}, description=${this.getDescription}, file=${this.getFileUrl}, sender_user=${this.getSenderUser?.getEmail}, validator_user=${this.getValidatorUser?.getEmail}, validated_at=${this.getValidatedAt}]`;
  }
}
