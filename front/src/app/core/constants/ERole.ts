export class Role {
  private _name: string = '';
  private _permissions: string[] = [''];

  constructor(name: string = '', permissions: string[] = []) {
    this._name = name;
    this._permissions = permissions;
  }

  public get getName(): string {
    return this._name;
  }

  public set setName(name: string) {
    this._name = name;
  }

  public get getPermissions(): string[] {
    return this._permissions;
  }

  public set setPermissions(permissions: string[]) {
    this._permissions = permissions;
  }

  hasPermission(permission: string): boolean {
    return this.getPermissions.includes(permission);
  }
}

export class RoleManager {
  private static _roles: Map<string, Role> = new Map<string, Role>([
    ['NONE', new Role('NONE', [])],
    ['USER', new Role('USER', ['USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE'])],
    [
      'ADMINISTRATOR',
      new Role('ADMINISTRATOR', [
        'ADMINISTRATOR_CREATE',
        'ADMINISTRATOR_READ',
        'ADMINISTRATOR_UPDATE',
        'ADMINISTRATOR_DELETE',
        'USER_CREATE',
        'USER_READ',
        'USER_UPDATE',
        'USER_DELETE',
      ]),
    ],
  ]);

  public static get NONE(): Role {
    return this._roles.get('NONE')!;
  }

  public static get USER(): Role {
    return this._roles.get('USER')!;
  }

  public static get ADMINISTRATOR(): Role {
    return this._roles.get('ADMINISTRATOR')!;
  }

  private constructor() {}
  private destructor() {}

  public static get getRoles() {
    return this._roles;
  }

  public static fromValue(value: string): Role | null {
    const normalizedValue = value.toUpperCase();
    return this._roles.get(normalizedValue) || null;
  }
}
