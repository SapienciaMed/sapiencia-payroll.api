import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IEmployment } from "App/Interfaces/EmploymentInterfaces";
import Employment from "App/Models/Employment";

export interface IEmploymentRepository {
  createEmployment(
    employment: IEmployment,
    trx: TransactionClientContract
  ): Promise<IEmployment>;
  getEmploymentWorkerById(id: number): Promise<IEmployment[] | null>;
}

export default class EmploymentRepository implements IEmploymentRepository {
  constructor() {}

  async getEmploymentWorkerById(id: number): Promise<IEmployment[] | null> {
    const res = await Employment.query().where("workerId", id);
    return res as IEmployment[];
  }

  async createEmployment(
    employment: IEmployment,
    trx: TransactionClientContract
  ): Promise<IEmployment> {
    const toCreate = new Employment().useTransaction(trx);

    toCreate.fill({ ...employment });
    await toCreate.save();
    return toCreate.serialize() as IEmployment;
  }
}
