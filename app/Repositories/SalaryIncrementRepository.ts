import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  ISalaryEditIncrement,
  ISalaryIncrement,
} from "App/Interfaces/SalaryIncrementInterfaces";
import SalaryIncrement from "App/Models/SalaryIncrement";

export interface ISalaryIncrementRepository {
  createSalaryIncrement(
    salaryIncrement: ISalaryIncrement,
    trx: TransactionClientContract
  ): Promise<ISalaryIncrement>;
  updateSalaryIncrement(
    salaryIncrement: ISalaryEditIncrement,
    trx: TransactionClientContract
  ): Promise<ISalaryEditIncrement | null>;
}

export default class SalaryIncrementRepository
  implements ISalaryIncrementRepository
{
  constructor() {}
  async createSalaryIncrement(
    salaryIncrement: ISalaryIncrement,
    trx: TransactionClientContract
  ): Promise<ISalaryIncrement> {
    const toCreate = new SalaryIncrement().useTransaction(trx);

    toCreate.fill({ ...salaryIncrement });
    await toCreate.save();
    return toCreate.serialize() as ISalaryIncrement;
  }

  async updateSalaryIncrement(
    salaryIncrement: ISalaryEditIncrement,
    trx: TransactionClientContract
  ): Promise<ISalaryEditIncrement | null> {
    const toUpdate = await SalaryIncrement.find(salaryIncrement.id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...salaryIncrement }).useTransaction(trx);

    await toUpdate.save();

    return toUpdate.serialize() as ISalaryEditIncrement;
  }
}
