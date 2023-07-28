<<<<<<< HEAD
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import IncapacityProvider from "@ioc:core.IncapacityProvider";
import IncapacityValidator from "App/Validators/IncapacityValidator";

export default class IncapacityController {
  // create Incapacity
  public async createIncapacity({ response, request }: HttpContextContract) {
    try {
      const data = await request.validate(IncapacityValidator);

      return response.send(await IncapacityProvider.createIncapacity(data));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
=======
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import IncapacityProvider from "@ioc:core.IncapacityProvider";
// import CreateAndUpdateVacationValidator from "App/Validators/CreateAndUpdateVacationValidator";
import { IIncapacity } from 'App/Interfaces/IncapacityInterfaces';

export default class IncapacityController {

  public async createIncapacity({ request, response }: HttpContextContract){

    try {

      const incapacity = request.body() as IIncapacity;
      return response.send(await IncapacityProvider.createIncapacity(incapacity))

    } catch (err) {

      return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));

    }

  }

>>>>>>> S3-NOM014
}
