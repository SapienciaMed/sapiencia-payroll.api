import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { ICharge } from "App/Interfaces/ChargeInterfaces";
import Charge from "App/Models/Charge";

export interface IChargesRepository {
  getChargeById(id: number): Promise<ICharge | null>;
  getChargesList(): Promise<ICharge[]>;
  updateChargeSalary(
    id: number,
    salary: number,
    trx: TransactionClientContract
  ): Promise<ICharge | null>;
}

export default class ChargesRepository implements IChargesRepository {
  constructor() {}
  async getChargeById(id: number): Promise<ICharge | null> {
    const res = await Charge.find(id);
    return res ? (res.serialize() as ICharge) : null;
  }

  async getChargesList(): Promise<ICharge[]> {
    const res = await Charge.all();
    return res as ICharge[];
  }

  async updateChargeSalary(
    id: number,
    salary: number,
    trx: TransactionClientContract
  ): Promise<ICharge | null> {
    const toUpdate = await Charge.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.merge({ ...toUpdate, baseSalary: salary }).useTransaction(trx);

    await toUpdate.save();
    return toUpdate.serialize() as ICharge;
  }
}
