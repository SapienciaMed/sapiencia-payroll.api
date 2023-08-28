import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import {
  ISalaryEditIncrement,
  ISalaryIncrement,
  ISalaryIncrementsFilters,
} from "App/Interfaces/SalaryIncrementInterfaces";
import salaryIncrementProvider from "@ioc:core.SalaryIncrementProvider";
import CreateSalaryIncrementValidator from "App/Validators/CreateSalaryIncrementValidator";
import Database from "@ioc:Adonis/Lucid/Database";

export default class SalaryIncrementsController {
  public async createSalaryIncrements({
    request,
    response,
  }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const salaryIncrement = await request.validate(
          CreateSalaryIncrementValidator
        );
        return response.send(
          await salaryIncrementProvider.createSalaryIncrement(
            salaryIncrement as ISalaryIncrement,
            trx
          )
        );
      } catch (err) {
        await trx.rollback();
        return response.badRequest(
          new ApiResponse(null, EResponseCodes.FAIL, String(err.messages))
        );
      }
    });
  }

  public async updateSalaryIncrements({
    request,
    response,
  }: HttpContextContract) {
    await Database.transaction(async (trx) => {
      try {
        const salaryIncrement = await request.validate(
          CreateSalaryIncrementValidator
        );
        return response.send(
          await salaryIncrementProvider.updataSalaryIncrement(
            salaryIncrement as ISalaryEditIncrement,
            trx
          )
        );
      } catch (err) {
        await trx.rollback();
        return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));
      }
    });
  }

  public async getSalaryHistoriesPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as ISalaryIncrementsFilters;
      return response.send(
        await salaryIncrementProvider.getSalaryHistoriesPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getSalaryIncrementById({
    response,
    request,
  }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(
        await salaryIncrementProvider.getSalaryIncrementById(id)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
