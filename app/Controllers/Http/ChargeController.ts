import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ChargeProvider from "@ioc:core.ChargeProvider";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { IChargeFilters } from "App/Interfaces/ChargeInterfaces";
import { ApiResponse } from "App/Utils/ApiResponses";
import CreateAndUpdateChargeValidator from "App/Validators/CreateAndUpdateChargeValidator";

export default class ChargeController {
  public async createCharge({ request, response }: HttpContextContract) {
    try {
      const charge = await request.validate(CreateAndUpdateChargeValidator);
      return response.send(await ChargeProvider.createCharge(charge));
    } catch (err) {
      response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getChargePaginate({ response, request }: HttpContextContract) {
    try {
      const data = request.body() as IChargeFilters;
      return response.send(await ChargeProvider.getChargesPaginate(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async updateCharge({ request, response }: HttpContextContract) {
    try {
      const chargeValidate = await request.validate(
        CreateAndUpdateChargeValidator
      );

      const { id } = chargeValidate;

      return response.send(
        await ChargeProvider.updateCharge(chargeValidate, Number(id))
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getChargeById({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await ChargeProvider.getChargeById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
