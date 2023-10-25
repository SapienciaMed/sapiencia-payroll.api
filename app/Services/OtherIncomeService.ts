import {
  IFilterOtherIncome,
  IGetOtherIncome,
  IOtherIncome,
} from "App/Interfaces/OtherIncomeInterfaces";

import { ApiResponse, IPagingData } from "../Utils/ApiResponses";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";

import { IOtherIncomeRepository } from "App/Repositories/OtherIncomeRepository";

export interface IOtherIncomeService {
  getOtherIncomePaginate(
    filters: IFilterOtherIncome
  ): Promise<ApiResponse<IPagingData<IGetOtherIncome>>>;
  getOtherIncomeById(id: number): Promise<ApiResponse<IOtherIncome>>;
  createOtherIncome(data: IOtherIncome): Promise<ApiResponse<IOtherIncome>>;
  updateOtherIncome(data: IOtherIncome): Promise<ApiResponse<IOtherIncome>>;
}

export default class OtherIncomeService implements IOtherIncomeService {
  constructor(private otherIncomeRepository: IOtherIncomeRepository) {}

  async getOtherIncomePaginate(
    filters: IFilterOtherIncome
  ): Promise<ApiResponse<IPagingData<IGetOtherIncome>>> {
    const taxDeductible =
      await this.otherIncomeRepository.getOtherIncomePaginate(filters);

    return new ApiResponse(taxDeductible, EResponseCodes.OK);
  }

  async getOtherIncomeById(id: number): Promise<ApiResponse<IOtherIncome>> {
    const res = await this.otherIncomeRepository.getOtherIncomeById(id);

    if (!res) {
      return new ApiResponse(
        {} as IOtherIncome,
        EResponseCodes.FAIL,
        "Recurso no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createOtherIncome(
    data: IOtherIncome
  ): Promise<ApiResponse<IOtherIncome>> {
    const res = await this.otherIncomeRepository.createOtherIncome(data);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateOtherIncome(
    data: IOtherIncome
  ): Promise<ApiResponse<IOtherIncome>> {
    const res = await this.otherIncomeRepository.updateOtherIncome(data);

    if (!res) {
      return new ApiResponse({} as IOtherIncome, EResponseCodes.OK);
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
