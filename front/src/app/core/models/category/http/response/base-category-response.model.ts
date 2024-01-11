import { Deserialize } from '../../../../../shared/transformation/deserialize';
import { Serialize } from '../../../../../shared/transformation/serialize';

export class BaseCategoryResponse implements Serialize<object>, Deserialize<string> {
  private _id: string;
  private _name: string;
  private _description: string;

  constructor(id: string = '', name: string = '', description: string = '') {
    this._id = id;
    this._name = name;
    this._description = description;
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

  public get getDescription(): string {
    return this._description;
  }

  public set setDescription(description: string) {
    this._description = description;
  }

  public serialize(): object {
    return {
      id: this.getId,
      name: this.getName,
      description: this.getDescription,
    };
  }

  deserialize(input: any): string {
    return Object.assign(this, input);
  }

  toString(): string {
    return `BaseCategoryResponse [name=${this._name}, description=${this._description}]`;
  }
}
