import { IWorker } from "App/Interfaces/WorkerInterfaces";
import Worker from "../Models/Worker";

export interface IWorkerRepository {
  getWorkerById(id: number): Promise<IWorker | null>;
}

export default class WorkerRepository implements IWorkerRepository {
  constructor() {}

  async getWorkerById(id: number): Promise<IWorker | null> {
    const res = await Worker.find(id);
    return res ? (res.serialize() as IWorker) : null;
  }
}
