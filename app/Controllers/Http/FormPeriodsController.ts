import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FormPeriodProvider from "@ioc:core.FormPeriodProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import {
  IFormPeriodFilters,
} from "App/Interfaces/FormPeriodInterface";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateFormPeriodValidator from "App/Validators/CreateAndUpdateFormPeriodValidator";

export default class FormPeriodsController {
  public async createFormPeriod({ request, response }: HttpContextContract) {
    try {
      const period = await request.validate(CreateAndUpdateFormPeriodValidator);
      return response.send(await FormPeriodProvider.createFormPeriod(period));
    } catch (err) {
      response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getFormTypes({ response }: HttpContextContract) {
    try {
      return response.send(await FormPeriodProvider.getFormTypes());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getLastPeriods({ response }: HttpContextContract) {
    try {
      return response.send(await FormPeriodProvider.getLastPeriods());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getFormPeriodPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IFormPeriodFilters;
      return response.send(
        await FormPeriodProvider.getManualDeductionPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateFormPeriod({ request, response }: HttpContextContract) {
    try {
      const formPeriodValidate = await request.validate(
        CreateAndUpdateFormPeriodValidator
      );

      const { id } = formPeriodValidate;

      return response.send(
        await FormPeriodProvider.updateFormPeriod(
          formPeriodValidate,
          Number(id)
        )
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
  public async getManualDeductionById({
    request,
    response,
  }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await FormPeriodProvider.getFormPeriodById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
