import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { EResponseCodes } from 'App/Constants/ResponseCodesEnum';
import { ApiResponse } from 'App/Utils/ApiResponses';
import LicenceProvider from "@ioc:core.LicenceProvider";
import CreateLicenceValidator from 'App/Validators/CreateLicenceValidator';
import { ILicence } from 'App/Interfaces/LicenceInterfaces';

export default class LicencesController {

    public async createLicence({ request, response }: HttpContextContract) {
        try {
          
          const licence = await request.validate(CreateLicenceValidator)
          return response.send(
            await LicenceProvider.createLicence(licence as ILicence)
          );
        } catch (err) {
          return new ApiResponse(null, EResponseCodes.FAIL, String(err.messages));
        }
      }
}
