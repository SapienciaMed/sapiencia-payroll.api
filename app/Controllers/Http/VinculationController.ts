import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";

import VinculationProvider from "@ioc:core.VinculationProvider";

import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IFilterEmployment } from "App/Interfaces/EmploymentInterfaces";
import { IFilterVinculation } from "App/Interfaces/VinculationInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateWorkerValidator from "App/Validators/CreateAndUpdateVinculationValidator";
import RetirementEmploymentValidator from "App/Validators/RetirementEmploymentValidator";

export default class VinculationController {
  public async createVinculation({ request, response }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const data = await request.validate(CreateAndUpdateWorkerValidator);
        return response.send(
          await VinculationProvider.createVinculation(data, trx)
        );
      } catch (err) {
        await trx.rollback();
        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );
      }
    });
  }

  public async updateVinculation({ request, response }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const data = await request.validate(CreateAndUpdateWorkerValidator);
        return response.send(
          await VinculationProvider.editVinculation(data, trx)
        );
      } catch (err) {
        await trx.rollback();
        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );
      }
    });
  }

  public async retirementEmployment({
    request,
    response,
  }: HttpContextContract) {
    try {
      const data = await request.validate(RetirementEmploymentValidator);
      return response.send(
        await VinculationProvider.retirementEmployment(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getVinculationsPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IFilterVinculation;
      return response.send(
        await VinculationProvider.getVinculationPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getEmploymentPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IFilterEmployment;
      return response.send(
        await VinculationProvider.getEmploymentPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getTypesContracts({ response }: HttpContextContract) {
    try {
      return response.send(await VinculationProvider.getTypesContractsList());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getCharges({ response }: HttpContextContract) {
    try {
      return response.send(await VinculationProvider.getChargesList());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getVinculationById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await VinculationProvider.getVinculationById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getEmploymentById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await VinculationProvider.getEmploymentById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getActiveWorkers({ response }: HttpContextContract) {
    try {
      return response.send(await VinculationProvider.getActiveWorkers());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getReasonsForWithdrawalList({ response }: HttpContextContract) {
    try {
      return response.send(
        await VinculationProvider.getReasonsForWithdrawalList()
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
