import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import VacationProvider from "@ioc:core.VacationProvider";
import CreateAndUpdateVacationValidator from "App/Validators/CreateAndUpdateVacationValidator";
import { IVacation } from 'App/Interfaces/VacationsInterfaces';


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

  //create vacation
  public async createVacation({ request, response }: HttpContextContract) {
    try {
      const vacation = request.body() as IVacation;
      //const vacation = await request.validate(CreateAndUpdateVacationValidator)
      return response.send(await VacationProvider.createVacation(vacation))
    } catch (err) {
      return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));
    }
  }

  //update vacation
  public async updateVacation({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();
      const vacation = await request.validate(CreateAndUpdateVacationValidator)
      return response.send(await VacationProvider.updateVacation(vacation, id))
    } catch (err) {
      new ApiResponse(null, EResponseCodes.FAIL, String(err));
    }
  }
  
}
