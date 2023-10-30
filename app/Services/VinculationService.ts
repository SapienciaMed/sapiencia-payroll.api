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
import { IWorker, IWorkerFilters } from "App/Interfaces/WorkerInterfaces";
import {
  IEmployment,
  IEmploymentWorker,
  IFilterEmployment,
  IReasonsForWithdrawal,
  IRetirementEmployment,
} from "App/Interfaces/EmploymentInterfaces";
import {
  IFilterContractSuspension,
  IcontractSuspension,
} from "App/Interfaces/ContractSuspensionInterfaces";
import { IContractSuspensionRepository } from "App/Repositories/ContractSuspensionRepository";
import { ISalaryHistoryRepository } from "App/Repositories/SalaryHistoryRepository";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
//import { ISalaryIncrementRepository } from "App/Repositories/SalaryIncrementRepository";
import { DateTime } from "luxon";

export interface IVinculationService {
  getWorkersByFilters(filters: IWorkerFilters): Promise<ApiResponse<IWorker[]>>;
  getVinculationPaginate(
    filters: IFilterVinculation
  ): Promise<ApiResponse<IPagingData<IGetVinculation>>>;
  getEmploymentPaginate(
    filters: IFilterEmployment
  ): Promise<ApiResponse<IPagingData<IEmployment>>>;
  getVinculationById(id: number): Promise<ApiResponse<IGetByVinculation>>;
  getActiveWorkers(temporary: boolean): Promise<ApiResponse<IWorker[]>>;
  getActivesContractorworkers(): Promise<ApiResponse<IWorker[]>>;
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
  getEmploymentById(id: number): Promise<ApiResponse<IEmployment[]>>;
  getReasonsForWithdrawalList(): Promise<ApiResponse<IReasonsForWithdrawal[]>>;
  retirementEmployment(
    data: IRetirementEmployment
  ): Promise<ApiResponse<IEmployment>>;
  getContractSuspensionPaginate(
    filters: IFilterContractSuspension
  ): Promise<ApiResponse<IPagingData<IcontractSuspension>>>;
  createContractSuspension(
    contractSuspension: IcontractSuspension,
    trx: TransactionClientContract
  ): Promise<ApiResponse<IcontractSuspension>>;
}

export default class VinculationService implements IVinculationService {
  constructor(
    private workerRepository: IWorkerRepository,
    private relativeRepository: IRelativeRepository,
    private employmentRepository: IEmploymentRepository,
    private TypesContractsRepository: ITypesContractsRepository,
    private typesChargesRepository: IChargesRepository,
    private contractSuspensionRepository: IContractSuspensionRepository,
    private salaryHistoryRepository: ISalaryHistoryRepository // private salaryIncrementRepository: ISalaryIncrementRepository
  ) {}

  async getWorkersByFilters(
    filters: IWorkerFilters
  ): Promise<ApiResponse<IWorker[]>> {
    const workers = await this.workerRepository.getWorkersByFilters(filters);

    return new ApiResponse(workers, EResponseCodes.OK);
  }

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

  async createContractSuspension(
    contractSuspension: IcontractSuspension,
    trx: TransactionClientContract
  ): Promise<ApiResponse<IcontractSuspension>> {
    const existingSuspension =
      await this.contractSuspensionRepository.getContractSuspensionBetweenDate(
        contractSuspension.codEmployment,
        contractSuspension.dateStart,
        contractSuspension.dateEnd
      );

    if (existingSuspension.length > 0) {
      return new ApiResponse(
        {} as IcontractSuspension,
        EResponseCodes.FAIL,
        "Ya existe una suspensión en las fechas indicadas"
      );
    }

    const newContractDate =
      contractSuspension.newDateEnd >
      DateTime.local()
        .endOf("year")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        ? DateTime.local()
            .endOf("year")
            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        : contractSuspension.newDateEnd;

    const adjustContractDate =
      contractSuspension.newDateEnd >
      DateTime.local()
        .endOf("year")
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const suspensionData = {
      ...contractSuspension,
      newDateEnd: newContractDate,
      adjustEndDate: adjustContractDate,
    };

    const suspensionResult =
      await this.contractSuspensionRepository.createContractSuspension(
        suspensionData,
        trx
      );

    await this.employmentRepository.updateContractDate(
      contractSuspension.codEmployment,
      newContractDate,
      trx
    );

    await trx.commit();

    return new ApiResponse(
      suspensionResult,
      EResponseCodes.OK,
      "La suspensión ha sido registrada exitosamente."
    );
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

    const employment = await this.employmentRepository.createEmployment(
      {
        ...data.employment,
        workerId: worker.id!,
      },
      trx
    );
    const charge = await this.typesChargesRepository.getChargeById(
      employment.idCharge
    );

    await this.salaryHistoryRepository.createManySalaryHistory(
      [
        {
          codEmployment: employment.id,
          // codIncrement: salaryIncrement?.id,
          previousSalary: 0,
          salary: charge?.baseSalary,
          validity: true,
          effectiveDate: data.employment.startDate,
        } as ISalaryHistory,
      ],
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

  async getActiveWorkers(temporary: boolean): Promise<ApiResponse<IWorker[]>> {
    const res = await this.workerRepository.getActivesWorkers(temporary);
    if (!res) {
      return new ApiResponse(
        {} as IWorker[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getActivesContractorworkers(): Promise<ApiResponse<IWorker[]>> {
    const res = await this.workerRepository.getActivesContractorworkers();
    if (!res) {
      return new ApiResponse(
        {} as IWorker[],
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

    if (!worker?.id) {
      return new ApiResponse(
        {} as IWorker,
        EResponseCodes.OK,
        "La vinculacion no se encuentra en el sistema"
      );
    }

    await this.relativeRepository.deleteManyRelativeByWorker(worker.id, trx);

    await this.relativeRepository.createManyRelatives(
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

  async getEmploymentById(
    id: number
  ): Promise<ApiResponse<IEmploymentWorker[]>> {
    const res = await this.employmentRepository.getEmploymentById(id);

    if (!res) {
      return new ApiResponse(
        {} as IEmploymentWorker[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getReasonsForWithdrawalList(): Promise<
    ApiResponse<IReasonsForWithdrawal[]>
  > {
    const res = await this.employmentRepository.getReasonsForWithdrawalList();

    if (!res) {
      return new ApiResponse(
        {} as IReasonsForWithdrawal[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async retirementEmployment(
    data: IRetirementEmployment
  ): Promise<ApiResponse<IEmployment>> {
    const res = await this.employmentRepository.retirementEmployment(data);

    if (!res) {
      return new ApiResponse(
        {} as IEmployment,
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getContractSuspensionPaginate(
    filters: IFilterContractSuspension
  ): Promise<ApiResponse<IPagingData<IcontractSuspension>>> {
    const Employments =
      await this.contractSuspensionRepository.getContractSuspensionPaginate(
        filters
      );
    return new ApiResponse(Employments, EResponseCodes.OK);
  }
}
