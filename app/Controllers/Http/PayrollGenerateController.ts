import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
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
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }
  public async payrollAuthorization({
    response,
    request,
  }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const { id } = request.params();
        return response.send(
          await PayrollGenerateProvider.authorizationPayroll(id, trx)
        );
      } catch (err) {
        await trx.rollback();
        return response.badRequest(
          new ApiResponse(
            null,
            EResponseCodes.FAIL,
            "Hubo un error con el servicio"
          )
        );
      }
    });
  }

  public async getTypesIncomes({ response, request }: HttpContextContract) {
    try {
      const { type } = request.qs();
      return response.send(
        await PayrollGenerateProvider.getTypesIncomeList(type)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }
}
