import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  ISalaryEditIncrement,
  ISalaryIncrement,
} from "App/Interfaces/SalaryIncrementInterfaces";
import SalaryIncrement from "App/Models/SalaryIncrement";
import { DateTime } from "luxon";

export interface ISalaryIncrementRepository {
  createSalaryIncrement(
    salaryIncrement: ISalaryIncrement,
    trx: TransactionClientContract
  ): Promise<ISalaryIncrement>;
  updateSalaryIncrement(
    salaryIncrement: ISalaryEditIncrement,
    trx: TransactionClientContract
  ): Promise<ISalaryEditIncrement | null>;
  getSalaryIncrementById(id: number): Promise<ISalaryEditIncrement | null>;
  getSalaryIncrementByChargeID(
    idCharge: number
  ): Promise<ISalaryEditIncrement | null>;
  getSalaryIncrementEffectiveDate(
    codCharge: number,
    date: DateTime
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

    toCreate.fill({ ...salaryIncrement, userCreate: undefined });
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

    toUpdate
      .fill({ ...toUpdate, ...salaryIncrement, userModified: undefined })
      .useTransaction(trx);

    await toUpdate.save();

    return toUpdate.serialize() as ISalaryEditIncrement;
  }

  async getSalaryIncrementById(
    id: number
  ): Promise<ISalaryEditIncrement | null> {
    const res = await SalaryIncrement.find(id);

    return res ? (res.serialize() as ISalaryEditIncrement) : null;
  }

  async getSalaryIncrementByChargeID(
    idCharge: number
  ): Promise<ISalaryEditIncrement | null> {
    const res = await SalaryIncrement.query()
      .where("codCharge", idCharge)
      .orderBy("id", "desc")
      .first();

    return res ? (res.serialize() as ISalaryEditIncrement) : null;
  }

  async getSalaryIncrementEffectiveDate(
    codCharge: number,
    date: DateTime
  ): Promise<ISalaryEditIncrement | null> {
    const res = await SalaryIncrement.query()
      .where("effectiveDate", date.toString())
      .andWhere("codCharge", codCharge)
      .firstOrFail();

    return res ? (res.serialize() as ISalaryEditIncrement) : null;
  }
}
