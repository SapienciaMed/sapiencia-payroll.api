import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";

import { IFormPeriodRepository } from "App/Repositories/FormsPeriod";

import { ApiResponse } from "App/Utils/ApiResponses";

export interface IFormPeriodService {
  createFormPeriod(formPeriod: IFormPeriod): Promise<ApiResponse<IFormPeriod>>;
}

export default class formPeriodService implements IFormPeriodService {
  constructor(private formPeriodRepository: IFormPeriodRepository) {}

  async createFormPeriod(
    formPeriod: IFormPeriod
  ): Promise<ApiResponse<IFormPeriod>> {
    const res = await this.formPeriodRepository.createFormPeriod(formPeriod);

    if (!res) {
      return new ApiResponse(
        {} as IFormPeriod,
        EResponseCodes.FAIL,
        "Ocurrió un error en su Transacción "
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
