import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IRelative } from "App/Interfaces/RelativeInterfaces";
import Relative from "App/Models/Relative";

export interface IRelativeRepository {
  createManyRelatives(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean>;
  getRelativeWorkerById(id: number): Promise<IRelative[] | null>;
}

export default class RelativeRepository implements IRelativeRepository {
  constructor() {}

  async getRelativeWorkerById(id: number): Promise<IRelative[] | null> {
    const res = await Relative.query().where("workerId", id);
    return res as IRelative[];
  }

  async createManyRelatives(relatives: IRelative[], trx): Promise<boolean> {
    Relative.createMany(relatives, trx);
    return true;
  }
}
