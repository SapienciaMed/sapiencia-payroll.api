import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FormPeriodProvider from "@ioc:core.FormPeriodProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IFormPeriodFilters } from "App/Interfaces/FormPeriodInterface";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateFormPeriodValidator from "App/Validators/CreateAndUpdateFormPeriodValidator";

export default class FormPeriodsController {
  public async createFormPeriod({ request, response }: HttpContextContract) {
    try {
      const period = await request.validate(CreateAndUpdateFormPeriodValidator);
      return response.send(await FormPeriodProvider.createFormPeriod(period));
    } catch (err) {
      response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }

  public async getFormTypes({ response }: HttpContextContract) {
    try {
      return response.send(await FormPeriodProvider.getFormTypes());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }

  public async getLastPeriods({ request, response }: HttpContextContract) {
    const { id } = request.params();
    try {
      return response.send(await FormPeriodProvider.getLastPeriods(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }

  public async getFormPeriod({ response }: HttpContextContract) {
    try {
      return response.send(await FormPeriodProvider.getFormPeriod());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }
  public async getPayrollVacation({ response }: HttpContextContract) {
    try {
      return response.send(await FormPeriodProvider.getPayrollVacation());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
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
        await FormPeriodProvider.getFormsPeriodPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
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
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }
  public async getFormPeriodById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await FormPeriodProvider.getFormPeriodById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(
          null,
          EResponseCodes.FAIL,
          "Hubo un error con el servicio"
        )
      );
    }
  }
}
