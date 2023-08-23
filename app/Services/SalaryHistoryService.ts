import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ISalaryHistory } from "App/Interfaces/SalaryHistoryInterfaces";
import { ISalaryHistoryRepository } from "App/Repositories/SalaryHistoryRepository";
import { ApiResponse } from "App/Utils/ApiResponses";

export interface ISalaryHistoryService {
  createSalaryHistory(
    salaryHistory: ISalaryHistory
  ): Promise<ApiResponse<ISalaryHistory>>;
}

export default class SalaryHistoryService implements ISalaryHistoryService {
  constructor(private salaryHistoryRepository: ISalaryHistoryRepository) {}

  async createSalaryHistory(
    salaryHistory: ISalaryHistory
  ): Promise<ApiResponse<ISalaryHistory>> {
    const res = await this.salaryHistoryRepository.createSalaryHistory(
      salaryHistory
    );

    if (!res) {
      return new ApiResponse(
        {} as ISalaryHistory,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
