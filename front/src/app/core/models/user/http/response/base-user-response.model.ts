import { Role, RoleManager } from '../../../../../core/constants/ERole';
import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class BaseUserResponse implements Serialize<object>, Deserialize<string> {
  private _id: string;
  private _createdAt: string;
  private _updatedAt: string;
  private _lastname: string;
  private _firstname: string;
  private _email: string;
  private _password: string;

  constructor(
    createdAt: string = '',
    updatedAt: string = '',
    id: string = '',
    lastname: string = '',
    firstname: string = '',
    email: string = '',
    password: string = '',
  ) {
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._id = id;
    this._lastname = lastname;
    this._firstname = firstname;
    this._email = email;
    this._password = password;
  }

  public get getCreatedAt(): string {
    return this._createdAt;
  }

  public set setCreatedAt(createdAt: string) {
    this._createdAt = createdAt;
  }

  public get getId(): string {
    return this._id;
  }

  public set setId(id: string) {
    this._id = id;
  }

  public get getUpdatedAt(): string {
    return this._updatedAt;
  }

  public set setUpdatedAt(updatedAt: string) {
    this._updatedAt = updatedAt;
  }

  public get getLastname(): string {
    return this._lastname;
  }

  public set setLastname(name: string) {
    this._lastname = name;
  }

  public get getFirstname(): string {
    return this._firstname;
  }

  public set setFirstname(firstname: string) {
    this._firstname = firstname;
  }

  public get getEmail(): string {
    return this._email;
  }

  public set setEmail(email: string) {
    this._email = email;
  }

  public get getPassword(): string {
    return this._password;
  }

  public set setPassword(password: string) {
    this._password = password;
  }

  public serialize(): object {
    return {
      created_at: this.getCreatedAt,
      updated_at: this.getUpdatedAt,
      id: this.getId,
      lastname: this.getLastname,
      firstname: this.getFirstname,
      email: this.getEmail,
      // password: this._password,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `BaseUserResponse [id=${this._id}, createdAt=${this._createdAt}, updatedAt=${this._updatedAt} lastname=${this._lastname}, firstname=${this._firstname}, email=${this._email}, password=${this._password}}]`;
  }
}
