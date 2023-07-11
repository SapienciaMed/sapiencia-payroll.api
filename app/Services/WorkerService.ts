import { ICreateWorker, IWorker } from "App/Interfaces/WorkerInterfaces";
import { IWorkerRepository } from "App/Repositories/WorkerRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IRelativeRepository } from "App/Repositories/RelativeRepository";
import { IEmploymentRepository } from "App/Repositories/EmploymentRepository";
import { ITypesCharges } from "App/Interfaces/TypesChargesInterfaces";
import { ITypesContracts } from "App/Interfaces/TypesContracts";
import { ITypesContractsRepository } from "App/Repositories/TypesContractsRepository";
import { ITypesChargesRepository } from "App/Repositories/TypesChargesRepository";

export interface IWorkerService {
  getWorkerById(id: number): Promise<ApiResponse<IWorker>>;
  createWorker(data: ICreateWorker): Promise<ApiResponse<IWorker>>;
  getTypeContractsById(id: number): Promise<ApiResponse<ITypesContracts>>;
  getTypesContractsList(): Promise<ApiResponse<ITypesContracts[]>>;
  getTypeChargeById(id: number): Promise<ApiResponse<ITypesCharges>>;
  getTypesChargesList(): Promise<ApiResponse<ITypesCharges[]>>;
}

export interface ITypesChargesService {

}

export interface ITypesContractsService {
  
}

export default class WorkerService implements IWorkerService {
  constructor(
    private workerRepository: IWorkerRepository,
    private relativeRepository: IRelativeRepository,
    private employmentRepository: IEmploymentRepository,
    private TypesContractsRepository: ITypesContractsRepository,
    private typesChargesRepository: ITypesChargesRepository
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

  async getTypeChargeById(id: number): Promise<ApiResponse<ITypesCharges>> {
    const res = await this.typesChargesRepository.getTypeChargeById(id);

    if (!res) {
      return new ApiResponse(
        {} as ITypesCharges,
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

  async getTypesChargesList(): Promise<ApiResponse<ITypesCharges[]>> {
    const res = await this.typesChargesRepository.getTypesChargesList();

    if (!res) {
      return new ApiResponse(
        {} as ITypesCharges[],
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
