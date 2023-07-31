import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import IncapacityProvider from "@ioc:core.IncapacityProvider";
import CreateAndUpdateIncapacityValidator from "App/Validators/CreateAndUpdateIncapacityValidator";
import { IIncapacity , IFilterIncapacity } from 'App/Interfaces/IncapacityInterfaces';

export default class IncapacityController {

  public async createIncapacity({ request, response }: HttpContextContract){

    try {

      //const incapacity = request.body() as IIncapacity;
      const incapacityValidate = await request.validate(CreateAndUpdateIncapacityValidator) as IIncapacity;
      return response.send(await IncapacityProvider.createIncapacity(incapacityValidate))

    } catch (err) {

      return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));

    }

  }

  public async getIncapacityPaginate({ response, request}: HttpContextContract) {

    try {

      const data = request.body() as IFilterIncapacity;
      return response.send( await IncapacityProvider.getIncapacityPaginate(data) );

    } catch (err) {

      return response.badRequest( new ApiResponse(null, EResponseCodes.FAIL, String(err)) );

    }

  }

}
