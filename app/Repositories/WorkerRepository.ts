import { IWorker } from "App/Interfaces/WorkerInterfaces";
import Worker from "../Models/Worker";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";

export interface IWorkerRepository {
  getWorkers(): Promise<IWorker[]>;
  getWorkerById(id: number): Promise<IWorker | null>;
  createWorker(
    worker: IWorker,
    trx: TransactionClientContract
  ): Promise<IWorker>;
}

export default class WorkerRepository implements IWorkerRepository {
  constructor() {}

  async getWorkers(): Promise<IWorker[]> {
    const res = await Worker.all();

    return res as IWorker[];
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
}
