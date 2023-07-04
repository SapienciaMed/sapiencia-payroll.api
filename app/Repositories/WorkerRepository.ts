import { IWorker } from "App/Interfaces/WorkerInterfaces";
import Worker from "../Models/Worker";
import { IRelative } from "App/Interfaces/RelativeInterfaces";
import { IJob } from "App/Interfaces/JobInterfaces";

export interface IWorkerRepository {
  getWorkerById(id: number): Promise<IWorker | null>;
  createWorker(worker: IWorker): Promise<IWorker>;
  createParentsWorker(relatives: IRelative[]): Promise<IRelative[]>;
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

  async createParentsWorker(relatives: IRelative[]): Promise<IRelative[]> {
    const toCreate = new Worker();

    const relativesCreate = await toCreate
      .related("relatives")
      .createMany(relatives);

    return relativesCreate as IRelative[];
  }

  async createJobWorker(job: IJob): Promise<IJob> {
    const toCreate = new Worker();

    const jobCreate = await toCreate.related("job").create(job);

    return jobCreate.serialize() as IJob;
  }
}
