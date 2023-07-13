import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

import WorkerProvider from "@ioc:core.WorkerProvider";

import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateWorkerValidator from "App/Validators/CreateAndUpdateWorkerValidator";

export default class EmploymentController {
  public async createWorker({ request, response }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const data = await request.validate(CreateAndUpdateWorkerValidator);
        return response.send(await WorkerProvider.createWorker(data, trx));
      } catch (err) {
        await trx.rollback();
        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );
      }
    });
  }

  public async getWorkers({ response }: HttpContextContract) {
    try {
      return response.send(await WorkerProvider.getWorkers());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getTypesContracts({ response }: HttpContextContract) {
    try {
      return response.send(await WorkerProvider.getTypesContractsList());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getCharges({ response }: HttpContextContract) {
    try {
      return response.send(await WorkerProvider.getChargesList());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getWorkerById({ response, request }: HttpContextContract) {
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
