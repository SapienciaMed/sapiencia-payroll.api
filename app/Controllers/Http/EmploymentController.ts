import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import WorkerProvider from "@ioc:core.WorkerProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateWorkerValidator from "App/Validators/CreateAndUpdateWorkerValidator";

export default class EmploymentController {
  public async createWorker({ request, response }: HttpContextContract) {
    try {
      const data = await request.validate(CreateAndUpdateWorkerValidator);
      return response.send(await WorkerProvider.createWorker(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
