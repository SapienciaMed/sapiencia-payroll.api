import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import VacationProvider from "@ioc:core.VacationProvider";
import CreateAndUpdateVacationValidator from "App/Validators/CreateVacationValidator";
import UpdateVacationValidator from "App/Validators/UpdateVacationValidator";
import {
  IVacation,
  IVacationFilters,
  IVacationSearchParams,
} from "App/Interfaces/VacationsInterfaces";
import { IEditVacation, IVacationDay } from "App/Interfaces/VacationDaysInterface";
import Database from "@ioc:Adonis/Lucid/Database";

export default class VacationsController {
  // get all vactions
  public async getVacations({ response }: HttpContextContract) {
    try {
      return response.send(await VacationProvider.getVacations());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  public async getVacationsByParams({
    request,
    response,
  }: HttpContextContract) {
    const params = request.all();
    try {
      return response.send(await VacationProvider.getVacationsByParams(params as IVacationSearchParams));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //create vacation
  public async createVacation({ request, response }: HttpContextContract) {
    try {
      const vacation = request.body() as IVacation;
      //const vacation = await request.validate(CreateAndUpdateVacationValidator)
      return response.send(await VacationProvider.createVacation(vacation));
    } catch (err) {
      return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));
    }
  }

  //update vacation
  public async updateVacationPeriod({
    request,
    response,
  }: HttpContextContract) {
    await Database.transaction(async (trx) => {
    try {
      const  vacationEdit  = await request.validate(UpdateVacationValidator);
      return response.send(await VacationProvider.updateVacation(vacationEdit as IEditVacation,trx));
    } catch (err) {
      await trx.rollback();
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  })
  }

  public async updateVacation({ request, response }: HttpContextContract) {
    try {
      const data = await request.params();
      return response.send(
        await VacationProvider.updateVacationDay(data as IVacationDay)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async createVacationDays({ request, response }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const data = await request.validate(CreateAndUpdateVacationValidator);
        return response.send(
          await VacationProvider.createManyVacation(data, trx)
        );
      } catch (err) {
        await trx.rollback();
        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err))
        );
      }
    });
  }
  public async getVacationsPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IVacationFilters;
      return response.send(await VacationProvider.getVacationPaginate(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
