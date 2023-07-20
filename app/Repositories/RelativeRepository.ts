import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IRelatives } from "App/Interfaces/RelativeInterfaces";
import Relatives from "App/Models/Relative";

export interface IRelativeRepository {
  createManyRelatives(
    relatives: IRelatives[],
    trx: TransactionClientContract
  ): Promise<boolean>;
  editOrInsertMany(
    relatives: IRelatives[],
    trx: TransactionClientContract
  ): Promise<boolean>;
  getRelativeWorkerById(id: number): Promise<IRelatives[] | null>;
}

export default class RelativeRepository implements IRelativeRepository {
  constructor() {}

  async getRelativeWorkerById(id: number): Promise<IRelatives[] | null> {
    const res = await Relatives.query().where("workerId", id);
    return res as IRelatives[];
  }

  async createManyRelatives(
    relatives: IRelatives[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    Relatives.createMany(relatives, trx);
    return true;
  }

  public async editOrInsertMany(
    relatives: IRelatives[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    await Promise.all(
      relatives.map(async ({ id, ...relativeData }) => {
        const toUpdate = await Relatives.findBy("id", id);

        if (toUpdate) {
          toUpdate.fill({ ...relativeData }).useTransaction(trx);
          await toUpdate.save();

          return toUpdate.serialize() as IRelatives;
        } else {
          const toCreate = new Relatives();

          toCreate.fill({ ...relativeData }).useTransaction(trx);
          await toCreate.save();

          return toCreate.serialize() as IRelatives;
        }
      })
    );

    return true;
  }
}
