import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';
import { BaseUserResponse } from './base-user-response.model';
import { BaseRoleResponse } from '../../../role/http/response/base-role-response.model';

export class UserResponse extends BaseUserResponse implements Serialize<object>, Deserialize<string> {
  private _roles: BaseRoleResponse[] | null;

  constructor(
    createdAt: string = '',
    updatedAt: string = '',
    id: string = '',
    lastname: string = '',
    firstname: string = '',
    email: string = '',
    password: string = '',
    roles: BaseRoleResponse[] | null = [],
  ) {
    super(createdAt, updatedAt, id, lastname, firstname, email, password);
    this._roles = roles;
  }

  public get getRoles(): BaseRoleResponse[] | null {
    return this._roles;
  }

  public set setRoles(roles: BaseRoleResponse[] | null) {
    this._roles = roles;
  }

  public override serialize(): object {
    return {
      ...super.serialize(),
    };
  }

  public override deserialize(input: any): string {
    return Object.assign(this, input);
  }

  public override toString(): string {
    const roleNames = this.getRoles?.map((role) => role.getName).join(', ') ?? '';
    return `UserResponse [id=${this.getId}, createdAt=${this.getCreatedAt}, updatedAt=${this.getUpdatedAt} lastname=${this.getLastname}, firstname=${this.getFirstname}, email=${this.getEmail}, password=${this.getPassword}, roles=${roleNames}]`;
  }
}
