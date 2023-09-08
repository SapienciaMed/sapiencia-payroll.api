import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import {
  IFormPeriod,
  IFormPeriodFilters,
} from "App/Interfaces/FormPeriodInterface";
import { IFormTypes } from "App/Interfaces/FormTypesInterface";

import { IFormPeriodRepository } from "App/Repositories/FormsPeriodRepository";

import { ApiResponse, IPagingData } from "App/Utils/ApiResponses";

export interface IFormPeriodService {
  createFormPeriod(formPeriod: IFormPeriod): Promise<ApiResponse<IFormPeriod>>;
  getFormTypes(): Promise<ApiResponse<IFormTypes[]>>;
  getLastPeriods(): Promise<ApiResponse<IFormPeriod[]>>;
  getManualDeductionPaginate(
    filters: IFormPeriodFilters
  ): Promise<ApiResponse<IPagingData<IFormPeriod>>>;
  getFormPeriodById(id: number): Promise<ApiResponse<IFormPeriod[]>>;
  updateFormPeriod(
    formPeriod: IFormPeriod,
    id: number
  ): Promise<ApiResponse<IFormPeriod | null>>;
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

  async updateFormPeriod(
    formPeriod: IFormPeriod,
    id: number
  ): Promise<ApiResponse<IFormPeriod | null>> {
    const res = await this.formPeriodRepository.updateFormPeriod(
      formPeriod,
      id
    );

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

  async getManualDeductionPaginate(
    filters: IFormPeriodFilters
  ): Promise<ApiResponse<IPagingData<IFormPeriod>>> {
    const vacations = await this.formPeriodRepository.getFormsPeriodPaginate(
      filters
    );
    return new ApiResponse(vacations, EResponseCodes.OK);
  }

  async getFormPeriodById(id: number): Promise<ApiResponse<IFormPeriod[]>> {
    const res = await this.formPeriodRepository.getFormPeriodById(id);

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
