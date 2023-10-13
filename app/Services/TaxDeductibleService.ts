import { ITaxDeductible } from "App/Interfaces/TaxDeductibleInterfaces";
import { ApiResponse } from "../Utils/ApiResponses";
import { ITaxDeductibleRepository } from "App/Repositories/TaxDeductibleRepository";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";

export interface ITaxDeductibleService {
  getTaxDeductibleById(id: number): Promise<ApiResponse<ITaxDeductible>>;
  createTaxDeductible(
    data: ITaxDeductible
  ): Promise<ApiResponse<ITaxDeductible>>;
}

export default class TaxDeductibleService implements ITaxDeductibleService {
  constructor(private taxDeductibleRepository: ITaxDeductibleRepository) {}

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
}
