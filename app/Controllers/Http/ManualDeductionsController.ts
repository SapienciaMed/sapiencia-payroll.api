import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ManualDeductionProvider from "@ioc:core.ManualDeductionProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
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
      const {type} = request.body();
      return response.send(
        await ManualDeductionProvider.getDeductionTypesByType(type)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
