import { ICreateWorker, IWorker } from "App/Interfaces/WorkerInterfaces";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IRelativeRepository } from "App/Repositories/RelativeRepository";
import { IEmploymentRepository } from "App/Repositories/EmploymentRepository";
import { ITypesContracts } from "App/Interfaces/TypesContractsInterfaces";
import { ITypesContractsRepository } from "App/Repositories/TypesContractsRepository";
import { IChargesRepository } from "App/Repositories/ChargesRepository";
import { ICharge } from "App/Interfaces/ChargeInterfaces";

export interface IWorkerService {
  getWorkerById(id: number): Promise<ApiResponse<IWorker>>;
  createWorker(data: ICreateWorker): Promise<ApiResponse<IWorker>>;
  getTypeContractsById(id: number): Promise<ApiResponse<ITypesContracts>>;
  getTypesContractsList(): Promise<ApiResponse<ITypesContracts[]>>;
  getChargeById(id: number): Promise<ApiResponse<ICharge>>;
  getChargesList(): Promise<ApiResponse<ICharge[]>>;
}


export default class WorkerService implements IWorkerService {
  constructor(
    private workerRepository: IWorkerRepository,
    private relativeRepository: IRelativeRepository,
    private employmentRepository: IEmploymentRepository,
    private TypesContractsRepository: ITypesContractsRepository,
    private typesChargesRepository: IChargesRepository
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

  async createWorker(data: ICreateWorker): Promise<ApiResponse<IWorker>> {
    const worker = await this.workerRepository.createWorker(data.worker);
    console.log(worker.id!)
    await this.relativeRepository.createManyRelatives(
      data.relatives.map((i) => {
        return {
          ...i,
          workerId: worker.id!,
        };
      })
    );

    await this.employmentRepository.createEmployment({
      ...data.employment,
      workerId: worker.id!,
    });

    return new ApiResponse(
      worker,
      EResponseCodes.OK,
      "El trabajador ha sido vinculado exitosamente."
    );
  }

  async getChargeById(id: number): Promise<ApiResponse<ICharge>> {
    const res = await this.typesChargesRepository.getChargeById(id);

    if (!res) {
      return new ApiResponse(
        {} as ICharge,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getTypeContractsById(id: number): Promise<ApiResponse<ITypesContracts>> {
    const res = await this.TypesContractsRepository.getTypeContractsById(id);

    if (!res) {
      return new ApiResponse(
        {} as ITypesContracts,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getChargesList(): Promise<ApiResponse<ICharge[]>> {
    const res = await this.typesChargesRepository.getChargesList();

    if (!res) {
      return new ApiResponse(
        {} as ICharge[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getTypesContractsList(): Promise<ApiResponse<ITypesContracts[]>> {
    const res = await this.TypesContractsRepository.getTypesContractsList();

    if (!res) {
      return new ApiResponse(
        {} as ITypesContracts[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

}
