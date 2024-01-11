import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseUserResponse } from '../../../user/http/response/base-user-response.model';
import { BaseRoleResponse } from './base-role-response.model';

export class RoleResponse extends BaseRoleResponse implements Serialize<object>, Deserialize<string> {
  private _users: BaseUserResponse[] = [];

  constructor(id: string = '', name: string = '', users: BaseUserResponse[] = []) {
    super(id, name);
    this._users = users;
  }

  public get getUsers() {
    return this._users;
  }

  public set setUsers(users: BaseUserResponse[]) {
    this._users = users;
  }

  public override serialize(): object {
    return {
      ...super.serialize(),
      users: this._users.map((user) => user.serialize()),
    };
  }

  public override deserialize(input: any): string {
    return Object.assign(this, input);
  }

  public override toString(): string {
    const userNames = this._users.map((user) => user.getLastname + ' ' + user.getFirstname).join(', ');
    return `RoleResponse [id=${this.getId}, name=${this.getName}, users=${userNames}]`;
  }
}
