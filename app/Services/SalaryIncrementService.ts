import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ISalaryIncrement } from "App/Interfaces/SalaryIncrementInterfaces";
import { ISalaryIncrementRepository } from "App/Repositories/SalaryIncrementRepository";
import { ApiResponse } from "App/Utils/ApiResponses";
export interface ISalaryIncrementService {
  createSalaryIncrement(
    salaryIncrement: ISalaryIncrement
  ): Promise<ApiResponse<ISalaryIncrement>>;
}

export default class SalaryIncrementService implements ISalaryIncrementService {
  constructor(private salaryIncrementRepository: ISalaryIncrementRepository) {}

  async createSalaryIncrement(
    salaryIncrement: ISalaryIncrement
  ): Promise<ApiResponse<ISalaryIncrement>> {
    const res = await this.salaryIncrementRepository.createSalaryIncrement(
      salaryIncrement
    );

    if (!res) {
      return new ApiResponse(
        {} as ISalaryIncrement,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
