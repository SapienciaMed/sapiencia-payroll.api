import { ISalaryIncrement } from "App/Interfaces/SalaryIncrementInterfaces";
import SalaryIncrement from "App/Models/SalaryIncrement";

export interface ISalaryIncrementRepository {
  createSalaryIncrement(
    salaryIncrement: ISalaryIncrement
  ): Promise<ISalaryIncrement>;
}

export default class SalaryIncrementRepository
  implements ISalaryIncrementRepository
{
  constructor() {}
  async createSalaryIncrement(
    salaryIncrement: ISalaryIncrement
  ): Promise<ISalaryIncrement> {
    const toCreate = new SalaryIncrement();

    toCreate.fill({ ...salaryIncrement });
    await toCreate.save();
    return toCreate.serialize() as ISalaryIncrement;
  }
}
