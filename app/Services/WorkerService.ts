import { IWorker } from "App/Interfaces/WorkerInterfaces";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";

export interface IWorkerService {
  getWorkerById(id: number): Promise<ApiResponse<IWorker>>;
}

export default class WorkerService implements IWorkerService {
  constructor(private workerRepository: IWorkerRepository) {}

  async getWorkerById(id: number): Promise<ApiResponse<IWorker>> {
    const res = await this.workerRepository.getWorkerById(id);

    if (!res) {
      return new ApiResponse(
        {} as IWorker,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
