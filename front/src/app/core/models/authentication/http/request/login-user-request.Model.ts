import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class LoginUserRequest implements Serialize<object>, Deserialize<string> {
  private _email: string;
  private _password: string;

  constructor(email: string = '', password: string = '') {
    this._email = email;
    this._password = password;
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
      email: this.getEmail,
      password: this.getPassword,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }
}
