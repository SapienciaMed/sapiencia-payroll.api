import { IIncapacity } from "App/Interfaces/IncapacityInterfaces";
import Incapacity from "App/Models/Incapacity";

export interface IIncapacityRepository {
  createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>
}

export default class IncapacityRepository implements IIncapacityRepository {

  constructor() { }

  async createIncapacity(incapacity: IIncapacity): Promise<IIncapacity>{

    const toCreate = new Incapacity();
    toCreate.fill({ ...incapacity });

    await toCreate.save();

    return toCreate.serialize() as IIncapacity;

  }

}
