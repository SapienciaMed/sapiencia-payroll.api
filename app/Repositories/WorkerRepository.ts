import { IWorker } from "App/Interfaces/WorkerInterfaces";
import Worker from "../Models/Worker";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import {
  IFilterVinculation,
  IGetVinculation,
} from "App/Interfaces/VinculationInterfaces";
import { IPagingData } from "App/Utils/ApiResponses";

export interface IWorkerRepository {
  getVinculation(
    filters: IFilterVinculation
  ): Promise<IPagingData<IGetVinculation>>;
  getWorkerById(id: number): Promise<IWorker | null>;
  createWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker>;
  editWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker | null>;
}

export default class WorkerRepository implements IWorkerRepository {
  constructor() {}

  async getVinculation(
    filters: IFilterVinculation
  ): Promise<IPagingData<IGetVinculation>> {
    const res = Worker.query();

    if (filters.name) {
      res.whereILike("firstName", filters.name).orWhereILike("secondName", `%${filters.name}%`);
    }

    if (filters.lastName) {
      res.whereILike("surname", filters.lastName).orWhereILike("secondSurname", `%${filters.lastName}%`);
    }

    if (filters.documentNumber) {
      res.whereILike("numberDocument", `%${filters.documentNumber}%`);
    }

    if (filters.state) {
      res.preload("employment").where("state", filters.state);
    }

    else if (filters.vinculationType) {
      res.preload("employment").where("idTypeContract", filters.vinculationType);
    }
    else{
      res.preload("employment")
    }

    const workerEmploymentPaginated = await res.paginate(
      filters.page,
      filters.perPage
    );

    const { data, meta } = workerEmploymentPaginated.serialize();
    const dataArray = data ?? [];

    return {
      array: dataArray as IGetVinculation[],
      meta,
    };
  }

  async getWorkerById(id: number): Promise<IWorker | null> {
    const res = await Worker.find(id);
    return res ? (res.serialize() as IWorker) : null;
  }

  async createWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker> {
    const toCreate = new Worker().useTransaction(trx);

    toCreate.fill({ ...worker });
    await toCreate.save();
    return toCreate.serialize() as IWorker;
  }

  async editWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker | null> {
    const toUpdate = await Worker.find(worker.id);

    if (!toUpdate) {
      return null;
    }

    toUpdate.fill({ ...worker }).useTransaction(trx);

    await toUpdate.save();

    return toUpdate.serialize() as IWorker;
  }
}
