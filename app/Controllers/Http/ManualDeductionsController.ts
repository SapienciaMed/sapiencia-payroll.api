import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ManualDeductionProvider from "@ioc:core.ManualDeductionProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IManualDeductionFilters } from "App/Interfaces/ManualDeductionsInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateManualDeductionsValidator from "App/Validators/CreateAndUpdateManualDeductionsValidator";

export default class ManualDeductionsController {
  public async createDeduction({ request, response }: HttpContextContract) {
    try {
      const deduction = await request.validate(
        CreateAndUpdateManualDeductionsValidator
      );
      return response.send(
        await ManualDeductionProvider.createManualDeduction(deduction)
      );
    } catch (err) {
      response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getDeductionTypesByType({
    request,
    response,
  }: HttpContextContract) {
    try {
      const { type } = request.params();
      return response.send(
        await ManualDeductionProvider.getDeductionTypesByType(type)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getManualDeductionPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IManualDeductionFilters;
      return response.send(
        await ManualDeductionProvider.getManualDeductionPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateManualDeduction({
    request,
    response,
  }: HttpContextContract) {
    try {
      const deductionValidate = await request.validate(
        CreateAndUpdateManualDeductionsValidator
      );

      const { id } = deductionValidate;

      return response.send(
        await ManualDeductionProvider.updateManualDeduction(
          deductionValidate,
          Number(id)
        )
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getManualDeductionById({
    request,
    response,
  }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(
        await ManualDeductionProvider.getManualDeductionById(id)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
