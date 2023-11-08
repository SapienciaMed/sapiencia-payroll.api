import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DependenceProvider from "@ioc:core.DependenceProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class DependenceController {
  public async getAllDependencies({ response }: HttpContextContract) {
    try {
      const res = await DependenceProvider.getAllDependencies();
      return response.send(res);
    } catch (err) {
      response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
