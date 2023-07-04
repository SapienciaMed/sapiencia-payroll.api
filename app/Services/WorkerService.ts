import { ICreateWorker, IWorker } from "App/Interfaces/WorkerInterfaces";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IRelativeRepository } from "App/Repositories/RelativeRepository";
import { IEmploymentRepository } from "App/Repositories/EmploymentRepository";

export interface IWorkerService {
  getWorkerById(id: number): Promise<ApiResponse<IWorker>>;
  cerateWorker(data: ICreateWorker): Promise<ApiResponse<IWorker>>;
}

export default class WorkerService implements IWorkerService {
  constructor(
    private workerRepository: IWorkerRepository,
    private relativeRepository: IRelativeRepository,
    private employmentRepository: IEmploymentRepository
  ) {}

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

  async cerateWorker(data: ICreateWorker): Promise<ApiResponse<IWorker>> {
    const worker = await this.workerRepository.createWorker(data.worker);

    await this.relativeRepository.createManyRelatives(
      data.relatives.map((i) => {
        return {
          ...i,
          workerId: worker.id,
        };
      })
    );

    await this.employmentRepository.createEmployment({
      ...data.employment,
      workerId: worker.id,
    });

    return new ApiResponse(
      worker,
      EResponseCodes.OK,
      "El trabajador ha sido vinculado exitosamente."
    );
  }
}
