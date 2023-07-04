import { IWorker } from "App/Interfaces/WorkerInterfaces";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";

export class WorkerRepositoryFake implements IWorkerRepository {
  getWorkerById(_id: number): Promise<IWorker | null> {
    return new Promise((res) => {
      res(null);
    });
  }
}
