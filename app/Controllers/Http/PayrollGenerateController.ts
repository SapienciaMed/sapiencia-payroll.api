import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PayrollGenerateProvider from "@ioc:core.PayrollGenerateProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class PayrollGenerateController {
  public async payrollGenerateById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(
        await PayrollGenerateProvider.payrollGenerateById(id)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
