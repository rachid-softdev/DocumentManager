import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class BaseRoleResponse implements Serialize<object>, Deserialize<string> {
  private _id: string;
  private _name: string;

  constructor(id: string = '', name: string = '') {
    this._id = id;
    this._name = name;
  }

  public get getId(): string {
    return this._id;
  }

  public set setId(id: string) {
    this._id = id;
  }

  public get getName(): string {
    return this._name;
  }

  public set setName(name: string) {
    this._name = name;
  }

  serialize(): object {
    return {
      id: this._id,
      name: this._name,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `BaseRoleResponse [id=${this._id}, name=${this._name}]`;
  }
}
