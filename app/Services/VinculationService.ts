import {
  ICreateOrUpdateVinculation,
  IGetByVinculation,
  IGetVinculation,
  IFilterVinculation,
} from "App/Interfaces/VinculationInterfaces";

import { IWorkerRepository } from "App/Repositories/WorkerRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
import { EResponseCodes } from "../Constants/ResponseCodesEnum";
import { IRelativeRepository } from "App/Repositories/RelativeRepository";
import { IEmploymentRepository } from "App/Repositories/EmploymentRepository";
import { ITypesContracts } from "App/Interfaces/TypesContractsInterfaces";
import { ITypesContractsRepository } from "App/Repositories/TypesContractsRepository";
import { IChargesRepository } from "App/Repositories/ChargesRepository";
import { ICharge } from "App/Interfaces/ChargeInterfaces";
import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { IWorker } from "App/Interfaces/WorkerInterfaces";
import {
  IEmployment,
  IFilterEmployment,
} from "App/Interfaces/EmploymentInterfaces";

export interface IVinculationService {
  getVinculationPaginate(
    filters: IFilterVinculation
  ): Promise<ApiResponse<IPagingData<IGetVinculation>>>;
  getEmploymentPaginate(
    filters: IFilterEmployment
  ): Promise<ApiResponse<IPagingData<IEmployment>>>;
  getVinculationById(id: number): Promise<ApiResponse<IGetByVinculation>>;
  createVinculation(
    data: ICreateOrUpdateVinculation,
    trx: TransactionClientContract
  ): Promise<ApiResponse<IWorker>>;
  getTypeContractsById(id: number): Promise<ApiResponse<ITypesContracts>>;
  getTypesContractsList(): Promise<ApiResponse<ITypesContracts[]>>;
  getChargeById(id: number): Promise<ApiResponse<ICharge>>;
  getChargesList(): Promise<ApiResponse<ICharge[]>>;
  editVinculation(
    data: ICreateOrUpdateVinculation,
    trx: TransactionClientContract
  ): Promise<ApiResponse<IWorker | null>>;
}

export default class VinculationService implements IVinculationService {
  constructor(
    private workerRepository: IWorkerRepository,
    private relativeRepository: IRelativeRepository,
    private employmentRepository: IEmploymentRepository,
    private TypesContractsRepository: ITypesContractsRepository,
    private typesChargesRepository: IChargesRepository
  ) {}

  async getVinculationPaginate(
    filters: IFilterVinculation
  ): Promise<ApiResponse<IPagingData<IGetVinculation>>> {
    const workers = await this.workerRepository.getVinculation(filters);

    return new ApiResponse(workers, EResponseCodes.OK);
  }

  async getEmploymentPaginate(
    filters: IFilterEmployment
  ): Promise<ApiResponse<IPagingData<IEmployment>>> {
    const Employments = await this.employmentRepository.getEmploymentWorker(
      filters
    );
    return new ApiResponse(Employments, EResponseCodes.OK);
  }

  async getVinculationById(
    id: number
  ): Promise<ApiResponse<IGetByVinculation>> {
    const worker = await this.workerRepository.getWorkerById(id);

    if (!worker?.id) {
      return new ApiResponse(
        {} as IGetByVinculation,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    const relatives = await this.relativeRepository.getRelativeWorkerById(
      worker.id
    );

    const employment = await this.employmentRepository.getEmploymentWorkerById(
      worker.id
    );

    const res = {
      worker,
      relatives,
      employment,
    } as IGetByVinculation;

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createVinculation(
    data: ICreateOrUpdateVinculation,
    trx: TransactionClientContract
  ): Promise<ApiResponse<IWorker>> {
    const worker = await this.workerRepository.createWorker(data.worker, trx);

    await this.relativeRepository.createManyRelatives(
      data.relatives.map((i) => {
        return {
          ...i,
          workerId: worker.id!,
        };
      }),
      trx
    );

    await this.employmentRepository.createEmployment(
      {
        ...data.employment,
        workerId: worker.id!,
      },
      trx
    );

    await trx.commit();

    return new ApiResponse(
      worker,
      EResponseCodes.OK,
      "La vinculacion ha sido registrada exitosamente."
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

  async getTypeContractsById(
    id: number
  ): Promise<ApiResponse<ITypesContracts>> {
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

  async editVinculation(
    data: ICreateOrUpdateVinculation,
    trx: TransactionClientContract
  ): Promise<ApiResponse<IWorker>> {
    const worker = await this.workerRepository.editWorker(data.worker, trx);

    if (!worker) {
      return new ApiResponse(
        {} as IWorker,
        EResponseCodes.OK,
        "La vinculacion no se encuentra en el sistema"
      );
    }

    await this.relativeRepository.editOrInsertMany(
      data.relatives.map((i) => {
        return {
          ...i,
          workerId: worker?.id!,
        };
      }),
      trx
    );

    await trx.commit();

    return new ApiResponse(
      worker,
      EResponseCodes.OK,
      "La vinculacion ha sido registrada exitosamente."
    );
  }
}
