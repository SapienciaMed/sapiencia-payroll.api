import { IWorker } from "App/Interfaces/WorkerInterfaces";
import Worker from "../Models/Worker";

export interface IWorkerRepository {
  getWorkerById(id: number): Promise<IWorker | null>;
  createWorker(worker: IWorker): Promise<IWorker>;
}

export default class WorkerRepository implements IWorkerRepository {
  constructor() {}

  async getWorkerById(id: number): Promise<IWorker | null> {
    const res = await Worker.find(id);
    return res ? (res.serialize() as IWorker) : null;
  }

  async createWorker(worker: IWorker): Promise<IWorker> {
    const toCreate = new Worker();

    toCreate.fill({ ...worker });
    await toCreate.save();
    return toCreate.serialize() as IWorker;
  }

}
