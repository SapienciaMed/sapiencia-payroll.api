import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import LicenceProvider from "@ioc:core.LicenceProvider";
import CreateLicenceValidator from "App/Validators/CreateLicenceValidator";
import { ILicence, ILicenceFilters } from "App/Interfaces/LicenceInterfaces";

export default class LicencesController {
  public async createLicence({ request, response }: HttpContextContract) {
    try {
      const licence = await request.validate(CreateLicenceValidator);
      return response.send(
        await LicenceProvider.createLicence(licence as ILicence)
      );
    } catch (err) {
      return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));
    }
  }

  public async getLicenceTypes({ response }: HttpContextContract) {
    try {
      return response.send(await LicenceProvider.getLicenceTypes());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  public async getLicencePaginate({ response, request }: HttpContextContract) {
    try {
      const data = request.body() as ILicenceFilters;
      return response.send(await LicenceProvider.getLicencePaginate(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
