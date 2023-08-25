import { TransactionClientContract } from "@ioc:Adonis/Lucid/Database";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import {
  ISalaryEditIncrement,
  ISalaryIncrement,
  ISalaryIncrementsFilters,
} from "App/Interfaces/SalaryIncrementInterfaces";
import { IChargesRepository } from "App/Repositories/ChargesRepository";
import { IEmploymentRepository } from "App/Repositories/EmploymentRepository";
import { ISalaryHistoryRepository } from "App/Repositories/SalaryHistoryRepository";
import { ISalaryIncrementRepository } from "App/Repositories/SalaryIncrementRepository";
import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";
export interface ISalaryIncrementService {
  createSalaryIncrement(
    salaryIncrement: ISalaryIncrement,
    trx: TransactionClientContract
  ): Promise<ApiResponse<ISalaryIncrement>>;
  updataSalaryIncrement(
    salaryIncrement: ISalaryEditIncrement,
    trx: TransactionClientContract
  ): Promise<ApiResponse<ISalaryEditIncrement | null>>;
  getSalaryHistoriesPaginate(
    filters: ISalaryIncrementsFilters
  ): Promise<ApiResponse<IPagingData<ISalaryHistory>>>;
}

export default class SalaryIncrementService implements ISalaryIncrementService {
  constructor(
    private salaryIncrementRepository: ISalaryIncrementRepository,
    private SalaryHistoryRepository: ISalaryHistoryRepository,
    private EmploymentRepository: IEmploymentRepository,
    private ChargeRepository: IChargesRepository
  ) {}

  async createSalaryIncrement(
    salaryIncrement: ISalaryIncrement,
    trx: TransactionClientContract
  ): Promise<ApiResponse<ISalaryIncrement>> {
    const res = await this.salaryIncrementRepository.createSalaryIncrement(
      salaryIncrement,
      trx
    );
    const employees = await this.EmploymentRepository.getEmploymentsbyCharge(
      salaryIncrement.codCharge
    );
    if (employees) {
      await this.SalaryHistoryRepository.createManySalaryHistory(
        employees.map((i) => {
          return {
            codEmployment: i.id,
            codIncrement: res.id,
            previousSalary: salaryIncrement.previousSalary,
            salary: salaryIncrement.newSalary,
            validity: false,
            effectiveDate: salaryIncrement.effectiveDate,
          } as ISalaryHistory;
        }),
        trx
      );
    }
    await this.ChargeRepository.updateChargeSalary(
      salaryIncrement.codCharge,
      salaryIncrement.newSalary,
      trx
    );
    await trx.commit();
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updataSalaryIncrement(
    salaryIncrement: ISalaryEditIncrement,
    trx: TransactionClientContract
  ): Promise<ApiResponse<ISalaryEditIncrement | null>> {
    const res = await this.salaryIncrementRepository.updateSalaryIncrement(
      salaryIncrement,
      trx
    );
    const salaryHistories =
      await this.SalaryHistoryRepository.getSalaryHistories(salaryIncrement.id);
    if (salaryHistories) {
      await this.SalaryHistoryRepository.updateManySalaryHistory(
        salaryHistories.map((i) => {
          return {
            id: i.id,
            codEmployment: i.codEmployment,
            codIncrement: i.codIncrement,
            previousSalary: salaryIncrement.previousSalary,
            salary: salaryIncrement.newSalary,
            validity: false,
            effectiveDate: salaryIncrement.effectiveDate,
          } as ISalaryHistory;
        }),
        trx
      );
    }
    await this.ChargeRepository.updateChargeSalary(
      salaryIncrement.codCharge,
      salaryIncrement.newSalary,
      trx
    );
    await trx.commit();
    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getSalaryHistoriesPaginate(
    filters: ISalaryIncrementsFilters
  ): Promise<ApiResponse<IPagingData<ISalaryHistory>>> {
    const salaryHistories =
      await this.SalaryHistoryRepository.getSalaryHistoriesPaginate(filters);
    return new ApiResponse(salaryHistories, EResponseCodes.OK);
  }
}
