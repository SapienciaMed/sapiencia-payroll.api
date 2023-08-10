import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  IEmployment,
  IFilterEmployment,
} from "App/Interfaces/EmploymentInterfaces";
import Employment from "App/Models/Employment";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IEmploymentRepository {
  createEmployment(
    employment: IEmployment,
    trx: TransactionClientContract
  ): Promise<IEmployment>;
  getEmploymentWorkerById(id: number): Promise<IEmployment[] | null>;
  getEmploymentWorker(
    filters: IFilterEmployment
  ): Promise<IPagingData<IEmployment>>;
  getEmploymentById(id: number): Promise<IEmployment | null>;
}

export default class EmploymentRepository implements IEmploymentRepository {
  constructor() {}

  async getEmploymentWorker(
    filters: IFilterEmployment
  ): Promise<IPagingData<IEmployment>> {
    const res = Employment.query();

    res.preload("typesContracts");
    res.preload("charges");
    res.where("workerId", filters.workerId);
    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IEmployment[],
      meta,
    };
  }
  async getEmploymentWorkerById(id: number): Promise<IEmployment[] | null> {
    const res = await Employment.query().where("workerId", id);
    return res as IEmployment[];
  }

  async getEmploymentById(id: number): Promise<IEmployment | null> {
    const res = await Employment.find(id);

    if (!res) {
      return null;
    }

    return res.serialize() as IEmployment;
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
