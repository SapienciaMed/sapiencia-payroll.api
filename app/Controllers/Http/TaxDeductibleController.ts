import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import TaxDeductibleProvider from "@ioc:core.TaxDeductibleProvider";
import TaxDeductibleValidator from "App/Validators/CreateAndUpdateTaxDeductibleValidator";
import { IFilterTaxDeductible } from "App/Interfaces/TaxDeductibleInterfaces";

export default class TaxDeductibleController {
  public async getTaxDeductiblePaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IFilterTaxDeductible;
      return response.send(
        await TaxDeductibleProvider.getTaxDeductiblePaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getTaxDeductibleById({
    response,
    request,
  }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(
        await TaxDeductibleProvider.getTaxDeductibleById(id)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async createTaxDeductible({ response, request }: HttpContextContract) {
    try {
      const data = await request.validate(TaxDeductibleValidator);
      return response.send(
        await TaxDeductibleProvider.createTaxDeductible(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateTaxDeductible({ response, request }: HttpContextContract) {
    try {
      const data = await request.validate(TaxDeductibleValidator);
      return response.send(
        await TaxDeductibleProvider.updateTaxDeductible(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
