import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { Role, RoleManager } from '../../../../constants/ERole';

export class RegisterUserRequest implements Serialize<object>, Deserialize<string> {
  private _firstname: string;
  private _lastname: string;
  private _email: string;
  private _password: string;
  private _role: Role;

  constructor(
    firstname: string = '',
    lastname: string = '',
    email: string = '',
    password: string = '',
    role: Role = RoleManager.USER,
  ) {
    this._firstname = firstname;
    this._lastname = lastname;
    this._email = email;
    this._password = password;
    this._role = role;
  }

  public get getFirstname(): string {
    return this._firstname;
  }

  public set setFirstname(firstname: string) {
    this._firstname = firstname;
  }

  public get getLastname(): string {
    return this._lastname;
  }

  public set setLastname(lastname: string) {
    this._lastname = lastname;
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

  public get getRole(): Role {
    return this._role;
  }

  public set setRole(role: Role) {
    this._role = role;
  }

  public serialize(): object {
    return {
      firstname: this.getFirstname,
      lastname: this.getLastname,
      email: this.getEmail,
      password: this.getPassword,
      confirmed_password: this.getPassword,
      role: this.getRole.getName,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }
}
