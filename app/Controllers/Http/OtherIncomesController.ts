import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";

import OtherIncomeProvider from "@ioc:core.OtherIncomeProvider";
import CreateAndUpdateOtherIncome from "App/Validators/CreateAndUpdateOtherIncomeValidator";
import { IFilterOtherIncome } from "App/Interfaces/OtherIncomeInterfaces";

export default class OtherIncomesController {
  public async getOtherIncomePaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IFilterOtherIncome;
      return response.send(
        await OtherIncomeProvider.getOtherIncomePaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getOtherIncomeById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await OtherIncomeProvider.getOtherIncomeById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async createOtherIncome({ response, request }: HttpContextContract) {
    try {
      const data = await request.validate(CreateAndUpdateOtherIncome);
      return response.send(await OtherIncomeProvider.createOtherIncome(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateOtherIncome({ response, request }: HttpContextContract) {
    try {
      const data = await request.validate(CreateAndUpdateOtherIncome);
      return response.send(await OtherIncomeProvider.updateOtherIncome(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
