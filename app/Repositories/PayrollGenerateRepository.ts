import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import { IGrouper } from "App/Interfaces/GrouperInterfaces";
import Employment from "App/Models/Employment";
import Grouper from "App/Models/Grouper";

export interface IPayrollGenerateRepository {
  getActiveEmploments(
    contractType: number,
    endDate: Date
  ): Promise<IEmployment[]>;
  getByIdGrouper(id: number): Promise<IGrouper>;
}
export default class PayrollGenerateRepository
  implements IPayrollGenerateRepository
{
  constructor() {}

  async getActiveEmploments(
    contractType: number,
    endDate: Date
  ): Promise<IEmployment[]> {
    const res = await Employment.query().preload("worker");

    return res.map((i) => i.serialize() as IEmployment);
  }

  async getByIdGrouper(id: number): Promise<IGrouper> {
    const res = await Grouper.findByOrFail("id", id);

    return res.serialize() as IGrouper;
  }
}
