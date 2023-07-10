import { IRelative } from "App/Interfaces/RelativeInterfaces";
import Relative from "App/Models/Relative";

export interface IRelativeRepository {
  createManyRelatives(relatives: IRelative[]): Promise<boolean>;
}

export default class WorkerRepository implements IRelativeRepository {
  constructor() {}

  async createManyRelatives(relatives: IRelative[]): Promise<boolean> {
    await Relative.createMany(relatives);
    return true;
  }
}
