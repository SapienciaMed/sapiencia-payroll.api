import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IRelative } from "App/Interfaces/RelativeInterfaces";
import Relative from "App/Models/Relative";

export interface IRelativeRepository {
  createManyRelatives(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean>;
  getRelativeWorkerById(id: number): Promise<IRelative[] | null>;
  createRelative(
    data: IRelative,
    trx?: TransactionClientContract
  ): Promise<IRelative>;
  deleteManyRelativeByWorker(
    id: number,
    trx?: TransactionClientContract
  ): Promise<boolean>;
}

export default class RelativeRepository implements IRelativeRepository {
  constructor() {}

  async getRelativeWorkerById(id: number): Promise<IRelative[] | null> {
    const res = await Relative.query().where("workerId", id);
    return res as IRelative[];
  }

  async createManyRelatives(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    await Relative.createMany(relatives, { client: trx });
    return true;
  }

  async createRelative(
    relative: IRelative,
    trx?: TransactionClientContract
  ): Promise<IRelative> {
    const toCreate = new Relative();

    toCreate.fill({ ...relative });

    if (trx) {
      toCreate.useTransaction(trx);
    }

    await toCreate.save();
    return toCreate.serialize() as IRelative;
  }

  async deleteManyRelativeByWorker(
    id: number,
    trx?: TransactionClientContract
  ) {
    const queryDeleteRelative = Relative.query().where("workerId", id).delete();

    if (trx) {
      queryDeleteRelative.useTransaction(trx);
    }

    await queryDeleteRelative;

    return true;
  }
}
