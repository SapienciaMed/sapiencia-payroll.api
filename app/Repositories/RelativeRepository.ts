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
  createRelative(
    data: IRelative,
    trx?: TransactionClientContract
  ): Promise<IRelative>;
  updateRelative(
    relative: IRelative,
    id: number,
    trx?: TransactionClientContract
  ): Promise<IRelative | null>;
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

  async updateRelative(
    relative: IRelative,
    id: number,
    trx?: TransactionClientContract
  ): Promise<IRelative | null> {
    const toUpdate = await Relative.find(id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...toUpdate, ...relative });

    if (trx) {
      toUpdate.useTransaction(trx);
    }

    await toUpdate.save();
    return toUpdate.serialize() as IRelative;
  }

  public async editOrInsertMany(
    relatives: IRelative[],
    trx: TransactionClientContract
  ): Promise<boolean> {
    await Promise.all(
      relatives.map(async ({ id, ...relativeData }) => {
        if (!id) {
          return this.createRelative(relativeData, trx);
        }

        const toUpdate = await Relative.find(id);

        if (toUpdate) {
          return this.updateRelative(relativeData, id, trx);
        } else {
          return this.createRelative(relativeData, trx);
        }
      })
    );

    return true;
  }
}
