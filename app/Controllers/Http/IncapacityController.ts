import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { EResponseCodes } from "App/Constants/ResponseCodesEnum";
import { ApiResponse } from "App/Utils/ApiResponses";
import IncapacityProvider from "@ioc:core.IncapacityProvider";
import CreateAndUpdateIncapacityValidator from "App/Validators/CreateAndUpdateIncapacityValidator";
import {
  IIncapacity,
  IFilterIncapacity,
} from "App/Interfaces/IncapacityInterfaces";

export default class IncapacityController {
  //?Crear incapacidad
  public async createIncapacity({ request, response }: HttpContextContract) {
    try {
      //const incapacity = request.body() as IIncapacity;
      const incapacityValidate = (await request.validate(
        CreateAndUpdateIncapacityValidator
      )) as IIncapacity;
      return response.send(
        await IncapacityProvider.createIncapacity(incapacityValidate)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //?Obtener el listado de tipos de incapacidad
  public async getIncapacityTypes({ response }: HttpContextContract) {
    try {
      return response.send(await IncapacityProvider.getIncapacityTypes());
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //?Obtener incapacidad (Con/Sin Filtro) -> Relacionadas JOIN
  public async getIncapacityPaginate({
    response,
    request,
  }: HttpContextContract) {
    try {
      const data = request.body() as IFilterIncapacity;
      return response.send(
        await IncapacityProvider.getIncapacityPaginate(data)
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //?Obtener incapacidad por ID -> Relationadas JOIN
  public async getIncapacityById({ response, request }: HttpContextContract) {
    try {
      const { id } = request.params();
      return response.send(await IncapacityProvider.getIncapacityById(id));
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }

  //?Actualizar -> Obtengo ID por desde Body petición
  public async updateIncapacity({ request, response }: HttpContextContract) {
    try {
      const incapacityValidate = (await request.validate(
        CreateAndUpdateIncapacityValidator
      )) as IIncapacity;

      const { id } = incapacityValidate;

      return response.send(
        await IncapacityProvider.updateIncapacity(
          incapacityValidate,
          Number(id)
        )
      );
    } catch (err) {
      return response.badRequest(
        new ApiResponse(null, EResponseCodes.FAIL, String(err))
      );
    }
  }
}
