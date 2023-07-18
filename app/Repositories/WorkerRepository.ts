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
    const { name, lastName, documentNumber, state, vinculationType, page, perPage } = filters;
  
    const query = Worker.query()
      .where((builder) => {
        if (name) {
          builder.whereILike("firstName", name).orWhereILike("secondName", `%${name}%`);
        }
        if (lastName) {
          builder.whereILike("surname", lastName).orWhereILike("secondSurname", `%${lastName}%`);
        }
        if (documentNumber) {
          builder.whereILike("numberDocument", `%${documentNumber}%`);
        }
      })
      .whereHas("employment", (employmentQuery) => {
        if (state) {
          employmentQuery.where("state", state);
        }
        if (vinculationType) {
          employmentQuery.where("idTypeContract", vinculationType);
        }
      })
      .preload("employment", (query) => {
        if (state) {
          query.where("state", state);
        }
        if (vinculationType) {
          query.where("idTypeContract", vinculationType);
        }
      });
  
    const workerEmploymentPaginated = await query.paginate(page, perPage);
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
