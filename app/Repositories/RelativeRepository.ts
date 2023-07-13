import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IRelative } from "App/Interfaces/RelativeInterfaces";
import Relative from "App/Models/Relative";

export interface IRelativeRepository {
  createManyRelatives(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean>;
  editOrInsertMany(
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

  async createManyRelatives(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    Relative.createMany(relatives, trx);
    return true;
  }

  public async editOrInsertMany(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    await Promise.all(
      relatives.map(async ({ id, ...relativeData }) => {
        const toUpdate = await Relative.findBy("id", id);

        if (toUpdate) {
          toUpdate.fill({ ...relativeData }).useTransaction(trx);
          await toUpdate.save();

          return toUpdate.serialize() as IRelative;
        } else {
          const toCreate = new Relative();

          toCreate.fill({ ...relativeData }).useTransaction(trx);
          await toCreate.save();

          return toCreate.serialize() as IRelative;
        }
      })
    );

    return true;
  }
}
