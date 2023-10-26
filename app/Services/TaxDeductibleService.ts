import {
  IFilterTaxDeductible,
  IGetTaxDeductible,
  ITaxDeductible,
} from "App/Interfaces/TaxDeductibleInterfaces";
import { ApiResponse, IPagingData } from "../Utils/ApiResponses";
import { ITaxDeductibleRepository } from "App/Repositories/TaxDeductibleRepository";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";

export interface ITaxDeductibleService {
  getTaxDeductiblePaginate(
    filters: IFilterTaxDeductible
  ): Promise<ApiResponse<IPagingData<IGetTaxDeductible>>>;
  getTaxDeductibleById(id: number): Promise<ApiResponse<ITaxDeductible>>;
  createTaxDeductible(
    data: ITaxDeductible
  ): Promise<ApiResponse<ITaxDeductible>>;
  updateTaxDeductible(
    data: ITaxDeductible
  ): Promise<ApiResponse<ITaxDeductible>>;
}

export default class TaxDeductibleService implements ITaxDeductibleService {
  constructor(private taxDeductibleRepository: ITaxDeductibleRepository) {}

  async getTaxDeductiblePaginate(
    filters: IFilterTaxDeductible
  ): Promise<ApiResponse<IPagingData<IGetTaxDeductible>>> {
    const taxDeductible =
      await this.taxDeductibleRepository.getTaxDeductiblePaginate(filters);

    return new ApiResponse(taxDeductible, EResponseCodes.OK);
  }

  async getTaxDeductibleById(id: number): Promise<ApiResponse<ITaxDeductible>> {
    const res = await this.taxDeductibleRepository.getTaxDeductibleById(id);

    if (!res) {
      return new ApiResponse(
        {} as ITaxDeductible,
        EResponseCodes.FAIL,
        "Recurso no encontrado"
      );
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async createTaxDeductible(
    data: ITaxDeductible
  ): Promise<ApiResponse<ITaxDeductible>> {
    const res = await this.taxDeductibleRepository.createTaxDeductible(data);

    return new ApiResponse(res, EResponseCodes.OK);
  }

  async updateTaxDeductible(
    data: ITaxDeductible
  ): Promise<ApiResponse<ITaxDeductible>> {
    const res = await this.taxDeductibleRepository.updateTaxDeductible(data);

    if (!res) {
      return new ApiResponse({} as ITaxDeductible, EResponseCodes.OK);
    }

    return new ApiResponse(res, EResponseCodes.OK);
  }
}
