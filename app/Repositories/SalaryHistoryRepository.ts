import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import SalaryHistory from "App/Models/SalaryHistory";

export interface ISalaryHistoryRepository {
  createSalaryHistory(salaryHistory: ISalaryHistory): Promise<ISalaryHistory>;
}

export default class SalaryHistoryRepository
  implements ISalaryHistoryRepository
{
  constructor() {}
  async createSalaryHistory(
    salaryHistory: ISalaryHistory
  ): Promise<ISalaryHistory> {
    const toCreate = new SalaryHistory();

    toCreate.fill({ ...salaryHistory });
    await toCreate.save();
    return toCreate.serialize() as ISalaryHistory;
  }
}
