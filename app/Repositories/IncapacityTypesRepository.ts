import { IGetIncapacity } from "App/Interfaces/IncapacityInterfaces";
import { IIncapacityTypes } from "App/Interfaces/TypesIncapacityInterface";
import TypesIncapacity from "App/Models/TypesIncapacity";

export interface IIncapacityTypesRepository {
  getIncapacityTypesById(id: number): Promise<IIncapacityTypes | null>;
  getIncapacityTypes(): Promise<IIncapacityTypes[]>;
}

export default class IncapacityTypesRepository
  implements IIncapacityTypesRepository
{
  constructor() {}

  async getIncapacityTypesById(id: number): Promise<IIncapacityTypes | null> {
    const res = await TypesIncapacity.find(id);
    return res ? (res.serialize() as IIncapacityTypes) : null;
  }

  async getIncapacityTypes(): Promise<IIncapacityTypes[]> {
    const res = await TypesIncapacity.all();
    return res as IIncapacityTypes[];
  }
}
