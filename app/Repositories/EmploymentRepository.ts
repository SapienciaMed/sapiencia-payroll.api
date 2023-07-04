import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import Employment from "App/Models/Employment";

export interface IEmploymentRepository {
  createEmployment(employment: IEmployment): Promise<IEmployment>;
}

export default class EmploymentRepository implements IEmploymentRepository {
  constructor() {}

  async createEmployment(employment: IEmployment): Promise<IEmployment> {
    const toCreate = new Employment();

    toCreate.fill({ ...employment });
    await toCreate.save();
    return toCreate.serialize() as IEmployment;
  }
}
