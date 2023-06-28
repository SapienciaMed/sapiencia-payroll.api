import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import WorkerProvider from "@ioc:core.WorkerProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

export default class WorkerController {
  public async getWorkerById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await WorkerProvider.getWorkerById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
