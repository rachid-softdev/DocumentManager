import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';

export class DocumentUpdateRequest implements Serialize<object>, Deserialize<string> {
  private _title: string;
  private _description: string;
  private _file: File | null;
  private _senderUser: BaseUserResponse | null;
  private _isValidated: boolean;
  private _validatorUser: BaseUserResponse | null;
  private _validatedAt: string;

  constructor(
    title: string = '',
    description: string = '',
    file: File | null = null,
    senderUser: BaseUserResponse | null = null,
    isValidated: boolean = false,
    validatorUser: BaseUserResponse | null = null,
    validatedAt: string = '',
  ) {
    this._title = title;
    this._description = description;
    this._file = file;
    this._senderUser = senderUser;
    this._isValidated = isValidated;
    this._validatorUser = validatorUser;
    this._validatedAt = validatedAt;
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

  public get getFile(): File | null {
    return this._file;
  }

  public set setFile(file: File | null) {
    this._file = file;
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
      title: this.getTitle,
      description: this.getDescription,
      file: this.getFile,
      sender_user: this.getSenderUser?.serialize(),
      validator_user: this.getValidatorUser?.serialize(),
      validated_at: this.getValidatedAt,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `DocumentUpdateRequest [title=${this.getTitle}, description=${this.getDescription}, sender_user=${this.getSenderUser?.getEmail}, is_validated=${this.getIsValidated}, validator_user=${this.getValidatorUser?.getEmail}, validated_at=${this.getValidatedAt}]`;
  }
}
