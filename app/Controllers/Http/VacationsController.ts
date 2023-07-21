import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import VacationProvider from "@ioc:core.VacationProvider";

export default class VacationsController {

  public async getVacations({ response }: HttpContextContract) {
    try {
      return response.send(await VacationProvider.getVacations());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  
}
