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
  public async payrollDownloadById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      response.header("Content-Type", "application/vnd.ms-excel");
      response.header(
        "Content-Disposition",
        "attachment; filename=ReportePlanilla.xlsx"
      );
      const result = await PayrollGenerateProvider.payrollDownloadById(id);
      response.send(new ApiResponse(result, EResponseCodes.OK));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getTypesIncomes({ response, request }: HttpContextContract) {
    try {
      const { type } = request.qs();
      return response.send(
        await PayrollGenerateProvider.getTypesIncomeList(type)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
