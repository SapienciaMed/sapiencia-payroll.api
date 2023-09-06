import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IFormPeriod } from "App/Interfaces/FormPeriodInterface";
import { IFormTypes } from "App/Interfaces/FormTypesInterface";

import { IFormPeriodRepository } from "App/Repositories/FormsPeriodRepository";

import { ApiResponse } from "App/Utils/ApiResponses";

export interface IFormPeriodService {
  createFormPeriod(formPeriod: IFormPeriod): Promise<ApiResponse<IFormPeriod>>;
  getFormTypes(): Promise<ApiResponse<IFormTypes[]>>;
  getLastPeriods(): Promise<ApiResponse<IFormPeriod[]>>;
}

export default class FormPeriodService implements IFormPeriodService {
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

  async getFormTypes(): Promise<ApiResponse<IFormTypes[]>> {
    const res = await this.formPeriodRepository.getFormTypes();
    if (!res) {
      return new ApiResponse(
        {} as IFormTypes[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async getLastPeriods(): Promise<ApiResponse<IFormPeriod[]>> {
    const res = await this.formPeriodRepository.getLastPeriods();
    if (!res) {
      return new ApiResponse(
        {} as IFormPeriod[],
        EResponseCodes.FAIL,
        "Registro no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
