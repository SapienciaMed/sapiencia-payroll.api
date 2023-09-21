import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import Employment from "App/Models/Employment";

export interface IPayrollGenerateRepository {
  getActiveEmploments(
    contractType: number,
    endDate: Date
  ): Promise<IEmployment[]>;
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
}
